import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Icon, Input, Row, Col } from "antd";
import "./volunteer.scss";
import { Link } from "react-router-dom";
import {
  checkStringContentSubString,
  convertRoleName,
} from "../../../../common/function";
import { getArrayLength } from "../../../../common/transformData";
import ExportVolunteerDataToExcel from "../../../../../export/ExportVolunteerDataToExcel";

function VolunteerListByClass(props) {
  const { volunteersData } = props;
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const transformVolunteerData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      phoneNumber: item.user.phoneNumber,
      role: convertRoleName(item.role).vie,
      classId: item.user.class?._id,
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
      title: t("role"),
      dataIndex: "role",
      key: "role",
      render: (text, key) => renderData(text, key),
      width: 100,
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
      {getArrayLength(searchData) ? (
        <>
          <Row>
            <Col span={14}></Col>
            <Col span={6}>
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
                      checkStringContentSubString(
                        entry.phoneNumber,
                        currValue
                      ) ||
                      checkStringContentSubString(entry.email, currValue)
                  );
                  setSearchData(filteredData);
                }}
              />
            </Col>
            <Col span={4}>
              <ExportVolunteerDataToExcel
                t={t}
                volunteersData={volunteersData}
              />
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={searchData}
          />
        </>
      ) : null}
    </div>
  );
}

export default VolunteerListByClass;
