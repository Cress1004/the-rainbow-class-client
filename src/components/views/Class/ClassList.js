import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Row, Input, Icon } from "antd";
import "./class-list.scss";
import { Link } from "react-router-dom";
import { getArrayLength, transformStudentTypes } from "../../common/transformData";
import {
  checkAdminAndVolunteerRole,
  checkAdminRole,
} from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";
import { checkStringContentSubString } from "../../common/function";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import useFetchAllClasses from "../../../hook/Class/useFetchAllClasses";
import common from "../../common";

function ClassList(props) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [classes, setClasses] = useState();
  const [searchData, setSearchData] = useState();
  const allClassData = useFetchAllClasses();
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;
  const teachingOptions = common.classConstant.TEACHING_OPTIONS;

  const transformClassData = (classes) => {
    return classes?.map((item, index) => ({
      key: index,
      id: item._id,
      name: item.name,
      description: item.description,
      classMonitor: item.classMonitor
        ? item.classMonitor?.user.name
        : `(${t("unset")})`,
      targetStudent: transformStudentTypes(item.studentTypes),
      numberOfStudent: getArrayLength(item.students),
      teachingOption: teachingOptions.find((data) => data.key === item.teachingOption)?.vie,
    }));
  };

  useEffect(() => {
    setClasses(transformClassData(allClassData));
    setSearchData(transformClassData(allClassData));
  }, [allClassData]);

  const columns = [
    {
      title: t("class_name"),
      dataIndex: "name",
      key: "name",
      render: (text, key) => renderData(text, key),
      width: 150,
    },
    {
      title: t("teaching_option"),
      dataIndex: "teachingOption",
      key: "teachingOption",
      width: 100,
      render: (text, key) =>
        renderData(
          text,
          key
        ),
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

  console.log(classes?.students)

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
        {checkAdminRole(userRole) && (
          <Button type="primary" className="class-list__add-class-button">
            <Link to="/add-class">{t("add_class")}</Link>
          </Button>
        )}
      </Row>
      <Table columns={columns} dataSource={searchData} />
    </div>
  );
}

export default ClassList;
