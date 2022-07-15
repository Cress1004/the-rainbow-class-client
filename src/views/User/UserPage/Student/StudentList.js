import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  Button,
  Row,
  Input,
  Icon,
  Popover,
  Form,
  Select,
  DatePicker,
  Col,
  InputNumber,
  message,
} from "antd";
import "./student.scss";
import { Link } from "react-router-dom";
import {
  transformStudentTypes,
} from "../../../../common/transformData";
import {
  ACHIEVEMENT_SELECT_OPTION,
  ACHIEVEMENT_SELECT_TITLE,
  COMPARE_SELECT_OPTION,
  FORMAT_MONTH_STRING,
  STUDENT,
  STUDENT_STATUS,
  SUPER_ADMIN,
} from "../../../../common/constant";
import PermissionDenied from "../../../../components/custom/Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchClassNameList from "../../../../hook/Class/useFetchClassNameList";
import useFetchStudentTypes from "../../../../hook/CommonData.js/useFetchStudentTypes";
import moment from "moment";
import useFetchSemesters from "../../../../hook/CommonData.js/useFetchSemesters";
import apis from "../../../../apis";
import queryString from "query-string";
import { parsePageSearchFilter } from "../../../../common/function/parseQueryString";

const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;

function StudentList(props) {
  const defaultParams = queryString.parse(window.location.search);
  defaultParams.limit = 10;
  const [listParams, setListParams] = useState(defaultParams);
  const [numberOfStudent, setNumberOfStudent] = useState();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [filter, setFilter] = useState();
  const { t } = useTranslation();
  const [studentsData, setStudentsData] = useState([]);
  const userData = useFetchCurrentUserData();
  const userRole = userData.userRole;
  const classNameList = useFetchClassNameList();
  const studentTypes = useFetchStudentTypes();
  const semesters = useFetchSemesters();
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  useEffect(() => {
    const filterData = listParams.query
      ? JSON.parse(decodeURI(listParams.query))
      : undefined;
    fetchStudentData(listParams);
    setFilter(filterData);
  }, [listParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStudentData = async () => {
    const data = await apis.student.getStudentsWithParams(listParams);
    if (data.success) {
      setStudentsData(transformStudentData(data.students));
      setNumberOfStudent(data.numberOfStudent);
    } else {
      message.error("Error");
    }
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

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };
  const tailLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  const transformStudentData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      classId: item.user.class,
      isActive: item.user.isActive,
      className: item.classInfo ? item.classInfo.name : t("unset"),
      phoneNumber: item.user.phoneNumber,
      studentTypes: item.studentTypes,
      studentTypesText: transformStudentTypes(item.studentTypes),
      isRetirement: item.retirementDate ? STUDENT_STATUS[1] : STUDENT_STATUS[0],
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
      title: t("student_types"),
      dataIndex: "studentTypesText",
      key: "studentTtypes",
      width: 220,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("status"),
      dataIndex: "isRetirement",
      key: "isRetirement",
      width: 100,
      render: (status, key) => renderData(status.text, key),
    },
  ];

  const renderData = (text, key) => {
    if (userRole.role === STUDENT) return <span>{text}</span>;
    else
      return (
        <Link to={`/students/${key.id}`} className={"text-in-table-row"}>
          <span>{text}</span>
        </Link>
      );
  };
  if (userRole && userRole.subRole === SUPER_ADMIN) {
    return <PermissionDenied />;
  }

  const content = (
    <div>
      <Form {...layout} style={{ width: "700px" }}>
        <Item label={t("class")}>
          <Select
            value={filter?.classInfo}
            placeholder={t("select_class")}
            onChange={(value) => setFilter({ ...filter, classInfo: value })}
          >
            {classNameList?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t("target_student")}>
          <Select
            mode="multiple"
            placeholder={t("select_student_type")}
            value={filter?.studentTypes}
            onChange={(value) => setFilter({ ...filter, studentTypes: value })}
          >
            {studentTypes?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Item>
        <Row>
          <Col span={2}></Col>
          <Col span={10}>
            {" "}
            <Item {...tailLayout} label={t("achievement")}>
              <Select
                placeholder={t("select_achievement_type")}
                value={filter?.achievementType}
                onChange={(value) =>
                  setFilter({ ...filter, achievementType: value })
                }
              >
                {ACHIEVEMENT_SELECT_OPTION?.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.text}
                  </Option>
                ))}
              </Select>
            </Item>
          </Col>
          <Col span={10}>
            {" "}
            {filter?.achievementType === ACHIEVEMENT_SELECT_TITLE.BY_MONTH ? (
              <Item {...tailLayout} label={t("select_month")}>
                <MonthPicker
                  onChange={(date, dateString) =>
                    setFilter({
                      ...filter,
                      semester: undefined,
                      month: dateString,
                    })
                  }
                  defaultValue={moment(currentMonth, FORMAT_MONTH_STRING)}
                  format={FORMAT_MONTH_STRING}
                  placeholder={t("select_month")}
                  style={{ width: "100%" }}
                />
              </Item>
            ) : (
              <Item {...tailLayout} label={t("select_semester")}>
                <Select
                  placeholder={t("select_semester")}
                  value={filter?.semester}
                  onChange={(value) =>
                    setFilter({ ...filter, month: undefined, semester: value })
                  }
                >
                  {semesters.map((option) => (
                    <Option key={option._id} value={option._id}>
                      {option.title}
                    </Option>
                  ))}
                </Select>
              </Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={10}>
            {" "}
            <Item {...tailLayout} label={t("achievement")}>
              <Select
                placeholder={t("select_compare_type")}
                value={filter?.compareType}
                onChange={(value) =>
                  setFilter({ ...filter, compareType: value })
                }
              >
                {COMPARE_SELECT_OPTION?.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.text}
                  </Option>
                ))}
              </Select>
            </Item>
          </Col>
          <Col span={4}>
            <InputNumber
              placeholder="inputNumber"
              min={0}
              max={10}
              value={filter?.point}
              onChange={(value) => setFilter({ ...filter, point: value })}
            />
          </Col>
        </Row>
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
      className={`student-list__filter student-list__filter--${
        filter ? "active" : ""
      }`}
    />
  );

  return (
    <div className="student-list">
      <div>
        <div className="student-list__title">{t("student_list")}</div>
        <Row>
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
          <Input
            className="student-list__search"
            prefix={<Icon type="search" />}
            placeholder={t("search_by_name_phone_email")}
            defaultValue={defaultParams.search || undefined}
            onChange={(e) => handleChangeSearchInput(e)}
          />
          {checkAdminAndMonitorRole(userRole) && (
            <Button type="primary" className="student-list__add-student-button">
              <Icon type="plus-circle" />{" "}
              <Link to="/add-student">{t("add_student")}</Link>
            </Button>
          )}
        </Row>
        <Table
          rowClassName={(record) =>
            `student-list__table--${
              record.isRetirement.key ? "deactive" : "active"
            }-row`
          }
          columns={columns}
          dataSource={studentsData}
          pagination={{
            total: numberOfStudent,
            defaultCurrent: defaultParams.offset
              ? parseInt(defaultParams.offset)
              : 1,
            onChange: (pageNumber) => handleChangePagination(pageNumber),
            pageSize: listParams.limit,
            title: null,
          }}
        />
      </div>
    </div>
  );
}

export default StudentList;
