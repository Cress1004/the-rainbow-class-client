import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Input, Table } from "antd";
import Axios from "axios";
import "./admin.scss";
import { checkStringContentSubString } from "../../../../common/function";

function AdminList(props) {
  const { t } = useTranslation();
  const [admin, setAdmin] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    Axios.post("/api/admin/get-admin", null).then((response) => {
      const result = response.data;
      if (result.success) {
        setAdmin(transformAdminData(result.admin));
        setSearchData(transformAdminData(result.admin));
      } else if (!result.success) {
        alert(result.message);
      } 
    });
  }, [t]);

  const transformAdminData = (adminData) => {
    return adminData?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      phoneNumber: item.user.phoneNumber,
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

  const renderData = (text) => (
    <span className="text-in-table-row">{text}</span>
  );

  return (
    <div className="admin-list">
      <div>
        <div className="admin-list__title">
          {t("admin")} ({`${admin?.length}`})
        </div>
        <Input
          className="admin-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_name_phone_email")}
          value={inputValue}
          onChange={(e) => {
            const currValue = e.target.value;
            setInputValue(currValue);
            const filteredData = admin.filter(
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
    </div>
  );
}

export default AdminList;
