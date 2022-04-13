import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, Icon, Input, Row } from "antd";
import "./volunteer.scss";
import { Link } from "react-router-dom";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../../../common/function";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import useFetchVolunteers from "../../../../../hook/Volunteer/useFetchVolunteers";
import { CLASS_MONITOR, SUB_CLASS_MONITOR } from "../../../../common/constant";
import useFetchClassNameList from "../../../../../hook/Class/useFetchClassNameList";
import { getArrayLength } from "../../../../common/transformData";

function VolunteerList(props) {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const currentUser = useFetchCurrentUserData();
  const userRole = currentUser.userRole;
  const volunteersData = useFetchVolunteers();
  const classNameList = useFetchClassNameList();

  const transformRoleName = (name, role) => {
    if (role === CLASS_MONITOR) {
      return `${name} (${t("short_class_monitor")})`;
    }
    if (role === SUB_CLASS_MONITOR) {
      return `${name} (${t("short_sub_class_monitor")})`;
    } else return name;
  };

  const transformVolunteerData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: transformRoleName(item.user.name, item.role),
      className: item.user.class ? item.user.class.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      role: item.role,
      classId: item.user.class._id,
      email: item.user.email,
      isActive: item.user.isActive,
    }));
  };

  useEffect(() => {
    setVolunteers(transformVolunteerData(volunteersData));
    setSearchData(transformVolunteerData(volunteersData));
  }, [volunteersData]);

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
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const renderData = (text, key) => (
    <Link to={`/volunteers/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  return (
    <div className="volunteer-list">
      <div className="volunteer-list__title">
        {t("volunteer_list")} ({`${volunteers?.length} ${t("volunteer")}`})
      </div>
      <Row>
        <Input
          className="volunteer-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_name_phone_email")}
          value={inputValue}
          onChange={(e) => {
            const currValue = e.target.value;
            setInputValue(currValue);
            const filteredData = volunteers.filter(
              (entry) =>
                checkStringContentSubString(entry.userName, currValue) ||
                checkStringContentSubString(entry.phoneNumber, currValue) ||
                checkStringContentSubString(entry.email, currValue)
            );
            setSearchData(filteredData);
          }}
        />
        {checkAdminAndMonitorRole(userRole) && (
          <Button
            type="primary"
            className="volunteer-list__add-volunteer-button"
          >
            <Icon type="plus-circle" />{" "}
            <Link to="/add-volunteer">{t("add_volunteer")}</Link>
          </Button>
        )}
      </Row>
      <Row className="volunteer-list__note">
        <span className="volunteer-list__note--deactive-record-note"></span>
        <span>{t("deactive_volunteer")}</span>
      </Row>
      <Table
        columns={columns}
        dataSource={searchData}
        rowClassName={(record) =>
          `volunteer-list__table--${
            record.isActive ? "active" : "deactive"
          }-row`
        }
      />
    </div>
  );
}

export default VolunteerList;
