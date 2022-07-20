import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  Button,
  Icon,
  Input,
  Row,
  message,
  Form,
  Select,
  Popover,
} from "antd";
import "./volunteer.scss";
import { Link } from "react-router-dom";
import { checkAdminAndMonitorRole, getCurrentUserUserData } from "../../../../common/function";
import { CLASS_MONITOR, SUB_CLASS_MONITOR } from "../../../../common/constant";
import useFetchClassNameList from "../../../../hook/Class/useFetchClassNameList";
import apis from "../../../../apis";
import queryString from "query-string";
import { parsePageSearchFilter } from "../../../../common/function/parseQueryString";

const { Item } = Form;
const { Option } = Select;

function VolunteerList(props) {
  const defaultParams = queryString.parse(window.location.search);
  defaultParams.limit = 10;
  const [listParams, setListParams] = useState(defaultParams);
  const [numberOfVolunteer, setNumberOfVolunteer] = useState();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [classInfo, setClassInfo] = useState();
  const { t } = useTranslation();
  const [volunteerData, setVolunteerData] = useState([]);
  const currentUser = getCurrentUserUserData();
  const classNameList = useFetchClassNameList();
  const userRole = currentUser.userRole;
  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  useEffect(() => {
    const filterData = listParams.query
      ? JSON.parse(decodeURI(listParams.query))
      : undefined;
    fetchVolunteers(listParams);
    setClassInfo(filterData?.classInfo);
  }, [listParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchVolunteers = async () => {
    const data = await apis.volunteer.getVolunteersWithParams(listParams);
    if (data.success) {
      setVolunteerData(transformVolunteerData(data.volunteers));
      setNumberOfVolunteer(data.numberOfVolunteer);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

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
      className: item.classInfo ? item.classInfo.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      role: item.role,
      classId: item?.classInfo?._id,
      email: item.user.email,
      isActive: item.user.isActive,
    }));
  };

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "userName",
      render: (text, key) => renderData(text, key),
      width: 175,
    },
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      width: 150,
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
    // {
    //   title: t("active_status"),
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   width: 100,
    //   render: (text, key) => renderData(text ? t("actived"): t("inactive"), key)
    // },
  ];

  const renderData = (text, key) => (
    <Link to={`/volunteers/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  const handleChangePagination = (pageNumber) => {
    setListParams({ ...listParams, offset: pageNumber });
    setListParams((listParams) => {
      window.history.replaceState(
        "",
        "",
        `?${parsePageSearchFilter(
          listParams.offset,
          listParams.search,
          listParams.filter
        )}`
      );
      return listParams;
    });
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
          listParams.filter
        )}`
      );
      return listParams;
    });
  };

  const handleChangeFilter = () => {
    setListParams({
      ...listParams,
      query: JSON.stringify({ classInfo: classInfo }),
      offset: 1,
    });
    setListParams((listParams) => {
      // fetchAllClassData(listParams);
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

  const content = (
    <div>
      <Form {...layout} style={{ width: "300px" }}>
        <Item label={t("class")}>
          <Select
            value={classInfo}
            placeholder={t("select_class")}
            onChange={(value) => setClassInfo(value)}
          >
            {classNameList?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.name}
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
      className={`volunteer-list__filter volunteer-list__filter--${
        defaultParams.filter ? "active" : ""
      }`}
    />
  );

  return (
    <div className="volunteer-list">
      <div className="volunteer-list__title">{t("volunteer_list")}</div>
      <Row>
        {userRole.isAdmin ? (
          <Popover
            content={content}
            trigger="click"
            visible={popoverVisible}
            onClick={() => setPopoverVisible(!popoverVisible)}
            placement="bottomLeft"
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            {filterIcon}
          </Popover>
        ) : null}
        <Input
          className="volunteer-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_name_phone_email")}
          defaultValue={defaultParams.search || undefined}
          onChange={(e) => handleChangeSearchInput(e)}
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
        dataSource={volunteerData}
        rowClassName={(record) =>
          `volunteer-list__table--${
            record?.isActive ? "active" : "deactive"
          }-row`
        }
        pagination={{
          total: numberOfVolunteer,
          defaultCurrent: defaultParams.offset
            ? parseInt(defaultParams.offset)
            : 1,
          onChange: (pageNumber) => handleChangePagination(pageNumber),
          pageSize: listParams.limit,
          title: null,
        }}
      />
    </div>
  );
}

export default VolunteerList;
