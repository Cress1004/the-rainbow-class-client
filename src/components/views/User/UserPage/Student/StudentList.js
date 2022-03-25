import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, Row, Input, Icon } from "antd";
import Axios from "axios";
import "./student.scss";
import { Link } from "react-router-dom";
import { transformStudentTypes } from "../../../../common/transformData";
import useFetchRole from "../../../../../hook/useFetchRole";
import { SUPER_ADMIN } from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../../../common/function";

function StudentList(props) {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const userId = localStorage.getItem("userId");
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;
  useEffect(() => {
    Axios.post("/api/students/get-students", { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.students;
          setStudents(transformStudentData(data));
          setSearchData(transformStudentData(data));
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, userId]);

  const transformStudentData = (data) => {
    return data.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      className: item.user.class ? item.user.class.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      studentTypes: transformStudentTypes(item.studentTypes),
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
      dataIndex: "studentTypes",
      key: "studentTtypes",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const renderData = (text, key) => (
    <Link to={`/students/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  if (userRole && userRole.subRole === SUPER_ADMIN) {
    return <PermissionDenied />;
  }

  return (
    <div className="student-list">
      {userRole && userRole.subRole !== SUPER_ADMIN && (
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
          </Row>
          {checkAdminAndMonitorRole(userRole) && (
            <Row>
              <Button type="primary" className="add-student-button">
                <Link to="/add-student">{t("add_student")}</Link>
              </Button>
            </Row>
          )}
          <Table columns={columns} dataSource={searchData} />
        </div>
      )}
    </div>
  );
}

export default StudentList;
