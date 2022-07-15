/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Input, message, Table } from "antd";
import "./admin.scss";
import { getArrayLength } from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";
import apis from "../../../../apis";
import queryString from "query-string";
import { parsePageAndSearch } from "../../../../common/function/parseQueryString";

function AdminList(props) {
  const defaultParams = queryString.parse(window.location.search);
  defaultParams.limit = 10;
  const [listParams, setListParams] = useState(defaultParams);
  const [numberOfAdmin, setNumberOfAdmin] = useState();
  const { t } = useTranslation();
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    fetchListAdmin(listParams);
  }, [listParams]);

  const fetchListAdmin = async () => {
    const data = await apis.admin.getListAdmin(listParams);
    if (data.success) {
      setAdmin(transformAdminData(data.admin));
      setNumberOfAdmin(data.numberOfAdmin);
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

  const handleChangeSearchInput = (e) => {
    setListParams({ ...listParams, search: e.target.value, offset: 1 });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageAndSearch(listParams.offset, listParams.search)}`
      );
      return listParams;
    });
  };

  const handleChangePagination = (pageNumber) => {
    setListParams({ ...listParams, offset: pageNumber });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageAndSearch(listParams.offset, listParams.search)}`
      );
      return listParams;
    });
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
        <div className="admin-list__title">{t("admin")}</div>
        <Input
          className="admin-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_name_phone_email")}
          defaultValue={defaultParams.search || undefined}
          onChange={(e) => handleChangeSearchInput(e)}
        />
        {getArrayLength(admin) ? (
          <Table
            columns={columns}
            dataSource={admin}
            pagination={{
              total: numberOfAdmin,
              defaultCurrent: defaultParams.offset
                ? parseInt(defaultParams.offset)
                : 1,
              onChange: (pageNumber) => handleChangePagination(pageNumber),
              pageSize: listParams.limit,
              title: null,
            }}
          />
        ) : (
          <TableNodata />
        )}
      </div>
    </div>
  );
}

export default AdminList;
