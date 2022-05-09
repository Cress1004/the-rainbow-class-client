import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, Row, Input, Icon } from "antd";
import "./student.scss";
import { Link } from "react-router-dom";
import {
  getArrayLength,
  transformStudentTypes,
} from "../../../../common/transformData";
import { STUDENT, SUPER_ADMIN } from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../../../common/function";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import useFetchStudents from "../../../../../hook/Student/useFetchStudents";
import useFetchClassNameList from "../../../../../hook/Class/useFetchClassNameList";
import useFetchStudentTypes from "../../../../../hook/CommonData.js/useFetchStudentTypes";
import TableNodata from "../../../NoData/TableNodata";

function StudentList(props) {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const userData = useFetchCurrentUserData();
  const userRole = userData.userRole;
  const studentsData = useFetchStudents();
  const classNameList = useFetchClassNameList();
  const studentTypes = useFetchStudentTypes();

  useEffect(() => {
    setStudents(transformStudentData(studentsData));
    setSearchData(transformStudentData(studentsData));
  }, [studentsData]);

  const transformStudentData = (data) => {
    return data.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      classId: item.user.class._id,
      isActive: item.user.isActive,
      className: item.user.class ? item.user.class.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      studentTypes: item.studentTypes,
      studentTypesText: transformStudentTypes(item.studentTypes),
    }));
  };

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      render: (text, key) => renderData(text, key),
      width: 130,
    },
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      width: 145,
      filters: getArrayLength(classNameList)
        ? classNameList.map((item) => ({
            text: item.name,
            value: item._id,
          }))
        : [],
      onFilter: (value, record) => record.classId === value,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("student_types"),
      dataIndex: "studentTypesText",
      key: "studentTtypes",
      width: 175,
      filters: getArrayLength(studentTypes)
        ? studentTypes.map((item) => ({
            text: item.title,
            value: item._id,
          }))
        : [],
      onFilter: (value, record) =>
        record.studentTypes.some((type) => type._id === value),
      render: (text, key) => renderData(text, key),
    },
  ];

  const renderData = (text, key) => {
    if (userRole.role === STUDENT) return <span>{text}</span>;
    else
      return (
        <Link to={`/students/${key.id}`} className={"text-in-table-row"}>
          <span>{text}</span>
        </Link>
      );
  };
  if (userRole && userRole.subRole === SUPER_ADMIN) {
    return <PermissionDenied />;
  }

  return (
    <div className="student-list">
      <div>
        <div className="student-list__title">
          {t("student_list")} ({`${students?.length} ${t("student")}`})
        </div>
        <Row>
          <Input
            className="student-list__search"
            prefix={<Icon type="search" />}
            placeholder={t("search_by_name_phone")}
            value={inputValue}
            onChange={(e) => {
              const currValue = e.target.value;
              setInputValue(currValue);
              const filteredData = students.filter(
                (entry) =>
                  checkStringContentSubString(entry.userName, currValue) ||
                  checkStringContentSubString(entry.phoneNumber, currValue) ||
                  checkStringContentSubString(entry.email, currValue)
              );
              setSearchData(filteredData);
            }}
          />
          {checkAdminAndMonitorRole(userRole) && (
            <Button type="primary" className="student-list__add-student-button">
              <Icon type="plus-circle" />{" "}
              <Link to="/add-student">{t("add_student")}</Link>
            </Button>
          )}
        </Row>
        {getArrayLength(searchData) ? (
          <Table columns={columns} dataSource={searchData} />
        ) : (
          <TableNodata />
        )}
      </div>
    </div>
  );
}

export default StudentList;
