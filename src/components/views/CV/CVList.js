import { Icon, Input, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useFetchCVList from "../../../hook/CV/useFetchCVList";
import useFetchClassNameList from "../../../hook/useFetchClassNameList";
import { CV_STATUS } from "../../common/constant";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../common/function";
import { getArrayLength } from "../../common/transformData";
import "./upload-cv.scss";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import PermissionDenied from "../Error/PermissionDenied";

function CVList(props) {
  const { t } = useTranslation();
  const cvList = useFetchCVList();
  const currentUserData = useFetchCurrentUserData();
  const classNameList = useFetchClassNameList();
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (getArrayLength(cvList)) {
      setSearchData(cvList);
    }
  }, [cvList]);

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => renderData(text, record),
      width: 150,
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, record) => renderData(text, record),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text, record) => renderData(text, record),
    },
    {
      title: t("register_class"),
      dataIndex: "className",
      key: "className",
      width: 175,
      filters: getArrayLength(classNameList)
        ? classNameList.map((item) => ({
            text: item.name,
            value: item._id,
          }))
        : [],
      onFilter: (value, record) => record.classId === value,
      render: (text, record) => renderData(record.className, record),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: CV_STATUS.map((item) => ({
        text: item.text,
        value: item.key,
      })),
      onFilter: (value, record) => record.status?.key === value,
      render: (text, record) => (
        <>
          {record.status ? (
            <div
              className="cv-list__status"
              style={{
                backgroundColor: `${record.status.color}`,
              }}
            >
              {record.status.text}
            </div>
          ) : null}
        </>
      ),
    },
  ];

  const renderData = (text, key) => (
    <Link to={`/cv/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  if (!checkAdminAndMonitorRole(currentUserData.userRole)) {
    return <PermissionDenied />;
  }

  return (
    <div className="cv-list">
      <div className="cv-list__title">{t("list_cv")}</div>
      <Input
        className="cv-list__search"
        prefix={<Icon type="search" />}
        placeholder={t("search_by_name_phone_email")}
        value={inputValue}
        onChange={(e) => {
          const currValue = e.target.value;
          setInputValue(currValue);
          const filteredData = cvList.filter(
            (entry) =>
              checkStringContentSubString(entry.userName, currValue) ||
              checkStringContentSubString(entry.phoneNumber, currValue) ||
              checkStringContentSubString(entry.email, currValue)
          );
          setSearchData(filteredData);
        }}
      />
      <Table columns={columns} dataSource={searchData} />
    </div>
  );
}

export default CVList;
