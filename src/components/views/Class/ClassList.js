/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Table,
  Row,
  Input,
  Icon,
  message,
  Popover,
  Form,
  Select,
} from "antd";
import "./class-list.scss";
import { Link } from "react-router-dom";
import {
  getArrayLength,
  transformAddressData,
  transformStudentTypes,
} from "../../common/transformData";
import {
  checkAdminAndVolunteerRole,
  checkAdminRole,
} from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import common from "../../common";
import TableNodata from "../NoData/TableNodata";
import queryString from "query-string";
import apis from "../../../apis";

const { Item } = Form;
const { Option } = Select;

function ClassList(props) {
  const defaultParams = queryString.parse(window.location.search);
  defaultParams.limit = 10;
  const { t } = useTranslation();
  const [classes, setClasses] = useState();
  const [listParams, setListParams] = useState(defaultParams);
  const [numberOfClasses, setNumberOfClasses] = useState();
  const [teachingOption, setTeachingOption] = useState();
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;
  const teachingOptions = common.classConstant.TEACHING_OPTIONS;

  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  const fetchAllClassData = async (listParams) => {
    const data = await apis.classes.getAllClassesWithParams(listParams);
    if (data.success) {
      setClasses(transformClassData(data.classes));
      setNumberOfClasses(data.allNumberOfClasses);
    } else {
      message.error(data.message);
    }
  };

  const parsePageSearchFilter = (offset, search, filter) => {
    return `offset=${offset}&search=${search || ''}&query=${filter ? encodeURI(filter) : ''}`
  }

  const onChangePagination = (pageNumber) => {
    setListParams({ ...listParams, offset: pageNumber });
    setListParams((listParams) => {
      // fetchAllClassData(listParams);
      window.history.replaceState(
        "",
        "",
        `?${parsePageSearchFilter(listParams.offset, listParams.search, listParams.query)}`
      );
      return listParams;
    });
  };

  const onChangeSearchInput = (e) => {
    setListParams({ ...listParams, search: e.target.value, offset: 1 });
    setListParams((listParams) => {
      // fetchAllClassData(listParams);
      window.history.replaceState("", "", `?${parsePageSearchFilter(listParams.offset, listParams.search, listParams.query)}`);
      return listParams;
    });
  };

  const handleChangeFilter = () => {
    setListParams({
      ...listParams,
      query: JSON.stringify({ teachingOption: teachingOption }),
      offset: 1
    });
    setListParams((listParams) => {
      // fetchAllClassData(listParams);
      window.history.replaceState("", "", `?${parsePageSearchFilter(listParams.offset, listParams.search, listParams.query)}`);
      return listParams;
    });
  };

  const resetFilter = () => {
    setListParams({...listParams, query: undefined, offset: 1})
    setListParams((listParams) => {
      window.history.replaceState("", "", `?${parsePageSearchFilter(listParams.offset, listParams.search, listParams.query)}`);
      return listParams;
    });
  }

  const transformClassData = (classes) => {
    return classes?.map((item, index) => ({
      key: index,
      id: item._id,
      name: item.name,
      description: item.description,
      classMonitor: item.classMonitor
        ? item.classMonitor?.user.name
        : `(${t("unset")})`,
      targetStudent: transformStudentTypes(item.studentTypes),
      numberOfStudent: getArrayLength(item.students),
      teachingOption: teachingOptions.find(
        (data) => data.key === item.teachingOption
      )?.vie,
      address: transformAddressData(item.address),
    }));
  };

  useEffect(() => {
    const filterData = listParams.query ? JSON.parse(decodeURI(listParams.query)) : undefined;
    fetchAllClassData(listParams);
    setTeachingOption(filterData?.teachingOption)
  }, [listParams]);

  const columns = [
    {
      title: t("class_name"),
      dataIndex: "name",
      key: "name",
      render: (text, key) => renderData(text, key),
      width: 150,
    },
    {
      title: t("teaching_option"),
      dataIndex: "teachingOption",
      key: "teachingOption",
      width: 100,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
      width: 130,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("class_monitor"),
      dataIndex: "classMonitor",
      key: "classMonitor",
      width: 110,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("target_student"),
      dataIndex: "targetStudent",
      key: "targetStudent",
      width: 140,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("number_of_student"),
      dataIndex: "numberOfStudent",
      key: "numberOfStudent",
      width: 50,
      render: (text, key) => renderData(text, key),
    },
  ];

  const renderData = (text, key) => (
    <Link to={`classes/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );
  if (!userRole || !checkAdminAndVolunteerRole(userRole)) {
    return <PermissionDenied />;
  }

  const content = (
    <div>
      <Form
        {...layout}
        style={{ width: "300px" }}
      >
        <Item label={t("teaching_option")}>
          <Select
            value={teachingOption}
            placeholder={t("select_teaching_option")}
            onChange={(value) => setTeachingOption(value)}
          >
            {teachingOptions?.map((option) => (
              <Option key={option.key} value={option.key}>
                {option.vie}
              </Option>
            ))}
          </Select>
        </Item>
        <div style={{ textAlign: "right" }}>
          <Button
             onClick={() => resetFilter()}
            style={{ marginRight: "10px" }}
          >
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
      className={`class-list__filter class-list__filter--${
        defaultParams.filter ? "active" : ""
      }`}
    />
  );

  return (
    <div className="class-list">
      <div className="class-list__title">{t("class_list")}</div>
      <Row>
        <Popover content={content} trigger="click" placement="bottomLeft">
          {filterIcon}
        </Popover>
        <Input
          className="class-list__search"
          prefix={<Icon type="search" />}
          placeholder={t("search_by_class_name")}
          defaultValue={defaultParams.search || undefined}
          onChange={(e) => onChangeSearchInput(e)}
        />
        {checkAdminRole(userRole) && (
          <Button type="primary" className="class-list__add-class-button">
             <Icon type="plus-circle" />{" "}
            <Link to="/add-class">{t("add_class")}</Link>
          </Button>
        )}
      </Row>
      {getArrayLength(classes) ? (
        <Table
          columns={columns}
          dataSource={classes}
          pagination={{
            total: numberOfClasses,
            defaultCurrent: defaultParams.offset ? parseInt(defaultParams.offset)  : 1,
            onChange: (pageNumber) => onChangePagination(pageNumber),
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

export default ClassList;
