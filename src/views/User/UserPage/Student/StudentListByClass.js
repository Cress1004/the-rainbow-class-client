import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Table, Row, Input, Icon, Col } from "antd";
import "./student.scss";
import { Link } from "react-router-dom";
import {
  getArrayLength,
  transformStudentTypes,
} from "../../../../common/transformData";
import { checkStringContentSubString } from "../../../../common/function";
import useFetchStudentTypes from "../../../../hook/CommonData.js/useFetchStudentTypes";
import ExportStudentDataToExcel from "../../../../export/ExportStudentDataToExcel";

function StudentListByClass(props) {
  const { studentsData } = props;
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const studentTypes = useFetchStudentTypes();

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
      phoneNumber: item.user.phoneNumber,
      studentTypes: item.studentTypes,
      studentTypesText: transformStudentTypes(item.studentTypes),
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
      title: t("student_types"),
      dataIndex: "studentTypesText",
      key: "studentTtypes",
      width: 175,
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
  ];

  // const handleClickExport = () => {
  //   const excel = new Excel();
  //   excel
  //     .addSheet("test")
  //     .addColumns(columns)
  //     .addDataSource(students)
  //     .saveAs("Excel.xlsx");
  // };

  const renderData = (text, key) => (
    <Link to={`/students/${key.id}`} className={"text-in-table-row"}>
      <span>{text}</span>
    </Link>
  );

  return (
    <div className="student-list">
      <div>
        {getArrayLength(students) ? (
          <>
            <Row>
              <Col span={11}></Col>
              <Col span={7}>
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
                        checkStringContentSubString(
                          entry.userName,
                          currValue
                        ) ||
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
              <Col span={6} className="volunteer-list__export-button">
                <ExportStudentDataToExcel
                  t={t}
                  studentsData={studentsData}
                />
              </Col>
            </Row>
            <Table columns={columns} dataSource={searchData} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default StudentListByClass;
