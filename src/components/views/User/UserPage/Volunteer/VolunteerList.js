import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, Icon, Input, Row } from "antd";
import Axios from "axios";
import "./volunteer.scss";
import { Link } from "react-router-dom";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../../../common/function";
import { CLASS_MONITOR, SUB_CLASS_MONITOR } from "../../../../common/constant";

function VolunteerList(props) {
  const { t } = useTranslation();
  const [volunteers, setVolunteers] = useState([]);
  const userId = localStorage.getItem("userId");
  const [userRole, setUserRole] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    Axios.post("/api/volunteers/get-volunteers", { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.volunteers;
          setVolunteers(transformVolunteerData(data));
          setSearchData(transformVolunteerData(data));
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
    Axios.post(`/api/users/get-role`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userRole;
        setUserRole(data);
      } 
    });
  }, [t, userId]);

  const transformVolunteerData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: transformRoleName(item.user.name, item.role),
      className: item.user.class ? item.user.class.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      role: item.role,
      email: item.user.email,
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
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 175,
      render: (text, key) => renderData(text, key),
    },
  ];

  const transformRoleName = (name, role) => {
    if (role === CLASS_MONITOR) {
      return `${name} (${t("short_class_monitor")})`;
    }
    if (role === SUB_CLASS_MONITOR) {
      return `${name} (${t("short_sub_class_monitor")})`;
    } else return name;
  };

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
      </Row>
      {checkAdminAndMonitorRole(userRole) && (
        <Row>
          <Button type="primary" className="add-volunteer-button">
            <Link to="/add-volunteer">{t("add_volunteer")}</Link>
          </Button>
        </Row>
      )}
      <Table columns={columns} dataSource={searchData} />
    </div>
  );
}

export default VolunteerList;
