import {
  Form,
  Icon,
  Input,
  message,
  Popover,
  Select,
  Table,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CV_STATUS } from "../../common/constant";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../common/function";
import { getArrayLength, transformDate } from "../../common/transformData";
import "./upload-cv.scss";
import useFetchCurrentUserData from "../../hook/User/useFetchCurrentUserData";
import PermissionDenied from "../Error/PermissionDenied";
import useFetchClassNameList from "../../hook/Class/useFetchClassNameList";
import TableNodata from "../NoData/TableNodata";
import apis from "../../apis";
import queryString from "query-string";
import {
  parsePageSearchFilter,
} from "../../common/function/parseQueryString";

const { Item } = Form;
const { Option } = Select;

function CVList(props) {
  const defaultParams = queryString.parse(window.location.search);
  defaultParams.limit = 10;
  const [listParams, setListParams] = useState(defaultParams);
  const { t } = useTranslation();
  const [cvList, setCvList] = useState([]);
  const [totalNumberOfCV, setTotalNumberOfCV] = useState();
  const [filter, setFilter] = useState();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const currentUserData = useFetchCurrentUserData();
  const classNameList = useFetchClassNameList();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  useEffect(() => {
    const filterData = listParams.query
      ? JSON.parse(decodeURI(listParams.query))
      : undefined;
    fetchListCV(listParams);
    setFilter(filterData);
  }, [listParams]);

  const fetchListCV = async () => {
    const data = await apis.cv.getAllCV(listParams);
    if (data.success) {
      setCvList(data.cvList);
      setTotalNumberOfCV(data.totalNumberOfCV);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const handleChangeSearchInput = (e) => {
    setListParams({ ...listParams, search: e.target.value, offset: 1 });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageSearchFilter(
          listParams.offset,
          listParams.search,
          listParams.query
        )}`
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
        `?${parsePageSearchFilter(
          listParams.offset,
          listParams.search,
          listParams.query
        )}`
      );
      return listParams;
    });
  };

  const handleChangeFilter = () => {
    setListParams({
      ...listParams,
      query: JSON.stringify(filter),
      offset: 1,
    });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageSearchFilter(
          listParams.offset,
          listParams.search,
          listParams.query
        )}`
      );
      return listParams;
    });
    setPopoverVisible(false);
  };

  const resetFilter = () => {
    setListParams({ ...listParams, query: undefined, offset: 1 });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageSearchFilter(
          listParams.offset,
          listParams.search,
          listParams.query
        )}`
      );
      return listParams;
    });
    setPopoverVisible(false);
  };

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => renderData(text, record),
      width: 170,
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, record) => renderData(text, record),
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      width: 170,
      render: (text, record) => renderData(text, record),
    },
    {
      title: t("register_class"),
      dataIndex: "classInfo",
      key: "_id",
      width: 170,
      render: (classInfo, record) => renderData(classInfo?.name, record),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text, record) => {
        const currentStatus = CV_STATUS.find(
          (item) => item.key == record.status
        );
        return (
          <>
            {currentStatus ? (
              <div
                className="cv-list__status"
                style={{
                  backgroundColor: `${currentStatus.color}`,
                }}
              >
                {currentStatus.text}
              </div>
            ) : null}
          </>
        );
      },
    },
    {
      title: t("created_time"),
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (text, record) => renderData(transformDate(text), record),
    },
  ];

  const renderData = (text, key) => (
    <Popover content={text}>
      <Link
        to={`/cv/${key._id}`}
        className={"text-in-table-row custom__text-1-line"}
      >
        <span>{text}</span>
      </Link>
    </Popover>
  );

  const content = (
    <div>
      <Form {...layout} style={{ width: "330px" }}>
        <Item label={t("class")}>
          <Select
            allowClear
            showSearch
            filterOption={(input, option) =>
              checkStringContentSubString(option.props.children, input)
            }
            value={filter?.classInfo}
            placeholder={t("ALL")}
            onChange={(value) => setFilter({ ...filter, classInfo: value })}
          >
            {classNameList?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t("status")}>
          <Select
            value={filter?.status}
            allowClear
            placeholder={t("ALL")}
            onChange={(value) => setFilter({ ...filter, status: value })}
          >
            {CV_STATUS?.map((option) => (
              <Option key={option.key} value={option.key}>
                {option.text}
              </Option>
            ))}
          </Select>
        </Item>
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => resetFilter()} style={{ marginRight: "10px" }}>
            {t("reset_filter")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => handleChangeFilter()}
          >
            {t("filter")}
          </Button>
        </div>
      </Form>
    </div>
  );

  const filterIcon = (
    <Icon
      type="filter"
      className={`cv-list__filter cv-list__filter--${
        defaultParams.query ? "active" : ""
      }`}
    />
  );

  if (!checkAdminAndMonitorRole(currentUserData.userRole)) {
    return <PermissionDenied />;
  }

  return (
    <div className="cv-list">
      <div className="cv-list__title">{t("list_cv")}</div>
      <div className="cv-list__tool">
        <Popover
          content={content}
          trigger="click"
          visible={popoverVisible}
          onClick={() => setPopoverVisible(!popoverVisible)}
          placement="bottomLeft"
          getPopupContainer={trigger => trigger.parentElement}
        >
          {filterIcon}
        </Popover>
        <Input
          className="cv-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_name_phone_email")}
          defaultValue={defaultParams.search || undefined}
          onChange={(e) => handleChangeSearchInput(e)}
        />
      </div>
      {getArrayLength(cvList) ? (
        <Table
          columns={columns}
          dataSource={cvList}
          pagination={{
            total: totalNumberOfCV,
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
  );
}

export default CVList;
