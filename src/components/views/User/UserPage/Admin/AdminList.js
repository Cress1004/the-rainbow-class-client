import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Input, message, Table } from "antd";
import "./admin.scss";
import { checkStringContentSubString } from "../../../../common/function";
import { getArrayLength } from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";
import apis from "../../../../../apis";

function AdminList(props) {
  const { t } = useTranslation();
  const [admin, setAdmin] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchListAdmin();
  }, []);

  const fetchListAdmin = async () => {
    const data = await apis.admin.getListAdmin(pagination);
    if (data.success) {
      setAdmin(transformAdminData(data.admin));
      setSearchData(transformAdminData(data.admin));
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

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
        {getArrayLength(searchData) ? (
          <Table columns={columns} dataSource={searchData} />
        ) : (
          <TableNodata />
        )}
      </div>
    </div>
  );
}

export default AdminList;
