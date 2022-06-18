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
  getArrayLength,
  transformStudentTypes,
} from "../../../../common/transformData";
import {
  ACHIEVEMENT_SELECT_OPTION,
  ACHIEVEMENT_SELECT_TITLE,
  COMPARE_SELECT_OPTION,
  COMPARE_SELECT_TITLE,
  FORMAT_MONTH_STRING,
  STUDENT,
  STUDENT_STATUS,
  SUPER_ADMIN,
} from "../../../../common/constant";
import { useFormik } from "formik";
import PermissionDenied from "../../../Error/PermissionDenied";
import {
  checkAdminAndMonitorRole,
  checkStringContentSubString,
} from "../../../../common/function";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import useFetchClassNameList from "../../../../../hook/Class/useFetchClassNameList";
import useFetchStudentTypes from "../../../../../hook/CommonData.js/useFetchStudentTypes";
import TableNodata from "../../../NoData/TableNodata";
import moment from "moment";
import useFetchSemesters from "../../../../../hook/CommonData.js/useFetchSemesters";
import { checkNowOverSemesterTime } from "../../../../common/function/checkTime";
import apis from "../../../../../apis";
const { Item } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;

function StudentList(props) {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const userData = useFetchCurrentUserData();
  const userRole = userData.userRole;
  const classNameList = useFetchClassNameList();
  const studentTypes = useFetchStudentTypes();
  const semesters = useFetchSemesters();
  const currentSem = semesters.find((item) =>
    checkNowOverSemesterTime(item.startDate, item.endDate)
  );
  const [filter, setFilter] = useState(false);
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  const fetchStudentData = async () => {
    const data = await apis.student.getStudents();
    if (data.success) {
      setStudentsData(data.students);
    } else {
      message.error("Error");
    }
  };

  const fetchStudentFilter = async (dataFilter) => {
    const data = await apis.student.studentFilter(dataFilter);
    if (data.success) {
      setStudentsData(data.students);
    } else {
      message.error("Error");
    }
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };
  const tailLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  const formik = useFormik({
    initialValues: {
      class: undefined,
      studentType: undefined,
      achievementType: ACHIEVEMENT_SELECT_TITLE.BY_MONTH,
      month: currentMonth,
      semester: currentSem,
      compareType: COMPARE_SELECT_TITLE.EQUAL,
      point: undefined,
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        fetchStudentFilter(values);
        setFilter(true);
        setSubmitting(false);
      }, 400);
    },
  });

  const resetFilter = () => {
    formik.resetForm();
    setFilter(false);
    fetchStudentData();
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    setStudents(transformStudentData(studentsData));
    setSearchData(transformStudentData(studentsData));
  }, [studentsData]);

  const transformStudentData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.user.name,
      classId: item.user.class._id,
      isActive: item.user.isActive,
      className: item.user.class ? item.user.class.name : t("unset"),
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
      width: 200,
    },
    {
      title: t("class_name"),
      dataIndex: "className",
      key: "className",
      width: 175,
      // filters: getArrayLength(classNameList)
      //   ? classNameList.map((item) => ({
      //       text: item.name,
      //       value: item._id,
      //     }))
      //   : [],
      // onFilter: (value, record) => record.classId === value,
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
      // filters: getArrayLength(studentTypes)
      //   ? studentTypes.map((item) => ({
      //       text: item.title,
      //       value: item._id,
      //     }))
      //   : [],
      // onFilter: (value, record) =>
      //   record.studentTypes.some((type) => type._id === value),
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("status"),
      dataIndex: "isRetirement",
      key: "isRetirement",
      filters: STUDENT_STATUS.map((item) => ({
        text: item.text,
        value: item.key,
      })),
      onFilter: (value, record) => record.isRetirement.key === value,
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
      <Form
        {...layout}
        onSubmit={formik.handleSubmit}
        style={{ width: "700px" }}
      >
        <Item label={t("class")}>
          <Select
            value={formik.values.class}
            placeholder={t("select_class")}
            onChange={(value) => formik.setFieldValue("class", value)}
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
            value={formik.values.studentType}
            onChange={(value) => formik.setFieldValue("studentType", value)}
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
                value={formik.values.achievementType}
                onChange={(value) =>
                  formik.setFieldValue("achievementType", value)
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
            {formik.values.achievementType ===
            ACHIEVEMENT_SELECT_TITLE.BY_MONTH ? (
              <Item {...tailLayout} label={t("select_month")}>
                <MonthPicker
                  onChange={(date, dateString) =>
                    formik.setFieldValue("month", dateString)
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
                  value={formik.values.semester}
                  onChange={(value) => formik.setFieldValue("semester", value)}
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
                value={formik.values.compareType}
                onChange={(value) => formik.setFieldValue("compareType", value)}
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
              value={formik.values.point}
              onChange={(value) => formik.setFieldValue("point", value)}
            />
          </Col>
        </Row>
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => resetFilter()} style={{ marginRight: "10px" }}>
            {t("reset_filter")}
          </Button>
          <Button type="primary" htmlType="submit">
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
        <div className="student-list__title">
          {t("student_list")} ({`${students?.length} ${t("student")}`})
        </div>
        <Row>
          <Popover content={content} trigger="click">
            {filterIcon}
          </Popover>
          <Input
            className="student-list__search"
            prefix={<Icon type="search" />}
            placeholder={t("search_by_name_phone")}
            value={inputValue}
            onChange={(e) => {
              const currValue = e.target.value;
              setInputValue(currValue);
              const filteredData = students.filter(
                (entry) =>
                  checkStringContentSubString(entry.userName, currValue) ||
                  checkStringContentSubString(entry.phoneNumber, currValue) ||
                  checkStringContentSubString(entry.email, currValue)
              );
              setSearchData(filteredData);
            }}
          />
          {checkAdminAndMonitorRole(userRole) && (
            <Button type="primary" className="student-list__add-student-button">
              <Icon type="plus-circle" />{" "}
              <Link to="/add-student">{t("add_student")}</Link>
            </Button>
          )}
        </Row>
        {getArrayLength(searchData) ? (
          <Table
            rowClassName={(record) =>
              `student-list__table--${
                record.isRetirement.key ? "deactive" : "active"
              }-row`
            }
            columns={columns}
            dataSource={searchData}
          />
        ) : (
          <TableNodata />
        )}
      </div>
    </div>
  );
}

export default StudentList;
