import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Row, Input, Icon } from "antd";
import "./class-list.scss";
import { Link } from "react-router-dom";
import Axios from "axios";
import {
  transformAddressData,
  transformStudentTypes,
} from "../../common/transformData";
import useFetchRole from "../../../hook/useFetchRole";
import {
  checkAdminAndVolunteerRole,
  checkAdminRole,
} from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";
import { checkStringContentSubString } from "../../common/function";

function ClassList(props) {
  const { t } = useTranslation();
  const [classes, setClasses] = useState();
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchRole(userId);
  const userRole = currentUserData.userRole;
  useEffect(() => {
    Axios.post("/api/classes/get-all-classes", null).then((response) => {
      if (response.data.success) {
        const data = response.data.classes;
        setClasses(transformClassData(data));
        setSearchData(transformClassData(data));
      } else if (!response.data.success) {
        alert(response.data.message);
      } 
    });
  }, [t]);

  const transformClassData = (classes) => {
    return classes?.map((item, index) => ({
      key: index,
      id: item._id,
      name: item.name,
      description: item.description,
      address: transformAddressData(item.address),
      classMonitor: item.classMonitor
        ? item.classMonitor?.user.name
        : `(${t("unset")})`,
      targetStudent: transformStudentTypes(item.studentTypes),
      numberOfStudent: item.students.length,
    }));
  };

  const columns = [
    {
      title: t("class_name"),
      dataIndex: "name",
      key: "name",
      render: (text, key) => renderData(text, key),
      width: 100,
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
      width: 150,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("class_monitor"),
      dataIndex: "classMonitor",
      key: "classMonitor",
      width: 120,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("target_student"),
      dataIndex: "targetStudent",
      key: "targetStudent",
      width: 150,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("number_of_student"),
      dataIndex: "numberOfStudent",
      key: "numberOfStudent",
      width: 50,
      render: (text, key) => renderData(text, key),
    },
  ];

  const renderData = (text, key) => (
    <Link to={`classes/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );
  if (!userRole || !checkAdminAndVolunteerRole(userRole)) {
    return <PermissionDenied />;
  }
  return (
    <div className="class-list">
      <div className="class-list__title">
        {t("class_list")} ({`${classes?.length} ${t("class")}`})
      </div>
      <Row>
        <Input
          className="class-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_class_name")}
          value={inputValue}
          onChange={(e) => {
            const currValue = e.target.value;
            setInputValue(currValue);
            const filteredData = classes.filter((entry) =>
              checkStringContentSubString(entry.name, currValue)
            );
            setSearchData(filteredData);
          }}
        />
      </Row>
      {checkAdminRole(userRole) && (
        <Row>
          <Button type="primary" className="add-class-button">
            <Link to="/add-class">{t("add_class")}</Link>
          </Button>
        </Row>
      )}
      <Table columns={columns} dataSource={searchData} />
    </div>
  );
}

export default ClassList;
