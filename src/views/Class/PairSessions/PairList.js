import { Button, Col, Icon, Popover, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import apis from "../../../apis";
import { ONLINE_OPTION } from "../../../common/constant";
import {
  getArrayLength,
  transformSubjects,
} from "../../../common/transformData";
import { useFormik } from "formik";
import RegisterPairForNewStudent from "../ClassDetailSessions/Tabs/RegisterPairForNewStudent";
import TableNodata from "../../../components/custom/NoData/TableNodata";
import "../class-list.scss";
import { checkStringContentSubString } from "../../../common/function";
import { Link } from "react-router-dom";

const { Option } = Select;

function PairList(props) {
  const { classData, fetchClassData } = props;
  const currentClassVolunteer = classData.volunteers;
  const { t } = useTranslation();
  const [editting, setEditting] = useState([]);
  const [addNewStudent, setAddNewStudent] = useState(false);
  const [pairsTeaching, setPairTeaching] = useState([]);

  const fetchSetPairVolunteer = async (classData, dataToSend) => {
    await apis.classes.setPairVolunteer(classData._id, dataToSend);
  };

  const resetEditting = (classData) => {
    classData.pairsTeaching.map((item, index) =>
      setEditting((editting) => [...editting, (editting[index] = false)])
    );
  };

  const formik = useFormik({
    initialValues: {
      pairId: "",
      volunteer: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchSetPairVolunteer(classData, values);
        fetchClassData(classData._id);
        setEditting([]);
        setSubmitting(false);
      }, 400);
    },
  });

  useEffect(() => {
    if (getArrayLength(classData.pairsTeaching)) {
      resetEditting(classData);
    }
    setPairTeaching(classData.pairsTeaching);
  }, [classData]);

  const changeEditting = (item) => {
    formik.setFieldValue("pairId", item.id);
    const edittingRecords = editting.map((edittingRecord, index) => {
      if (index == item.key) return !editting[index];
      else return editting[index];
    });
    setEditting(edittingRecords);
  };

  const unRegisterStudents = pairsTeaching?.filter((item) => item.status === 0);

  const waittingStudent = pairsTeaching?.filter((item) => !item.volunteer);

  const tableOrgData = pairsTeaching?.filter(
    (item) => !unRegisterStudents.includes(item)
  );

  const pairedVolunteers = classData.pairsTeaching.map((item) => item?.volunteer?._id);

  const dataSource = tableOrgData
    ? tableOrgData.map((item, index) => ({
        key: index,
        id: item._id,
        studentName: item.student.user.name,
        volunteerName: item.volunteer?.user.name,
        teachOption:
          item.teachOption === ONLINE_OPTION ? t("online") : t("offline"),
        grade: item.grade?.title,
        subjects: transformSubjects(item.subjects),
      }))
    : [];

  const columns = [
    {
      title: t("student_name"),
      dataIndex: "studentName",
      key: "studentName",
      render: (text) => renderText(text),
      width: 175,
    },
    {
      title: t("volunteer_incharge"),
      dataIndex: "volunteerName",
      key: "volunteerName",
      render: (text, item) => (
        <span>
          {editting[item.key] ? (
            <div>
              <Select
                allowClear
                showSearch
                filterOption={(input, option) =>
                  checkStringContentSubString(option.props.children, input)
                }
                defaultValue={item.volunteerName}
                placeholder={t("input_volunteer_incharge")}
                onChange={(value) => formik.setFieldValue("volunteer", value)}
                style={{ width: "100%", marginBottom: "5px" }}
              >
                {currentClassVolunteer?.map((option) => (
                  <Option
                    key={option.key}
                    value={option._id}
                    disabled={option.user.name !== item.volunteerName && pairedVolunteers.includes(option._id)}
                  >
                    {option.user.name}
                  </Option>
                ))}
              </Select>
              <>
                <Button
                  onClick={formik.handleSubmit}
                  style={{ marginRight: "10px" }}
                  type="primary"
                >
                  {t("submit")}
                </Button>
                <Button onClick={() => changeEditting(item)}>
                  {t("cancel")}
                </Button>
              </>
            </div>
          ) : (
            <div>
              <span>{text ? text : t("unset")}</span>{" "}
              <Icon type="edit" onClick={() => changeEditting(item)} />
            </div>
          )}
        </span>
      ),
      width: 175,
    },
    {
      title: t("Hình thức"),
      dataIndex: "teachOption",
      key: "teachOption",
      render: (text, item) => renderText(text),
      width: 100,
    },
    {
      title: t("grade"),
      dataIndex: "grade",
      key: "grade",
      render: (text, item) => renderText(text),
      width: 75,
    },
    {
      title: t("subjects"),
      dataIndex: "subjects",
      key: "subjects",
      render: (text, item) => renderText(text),
      width: 150,
    },
    {
      title: t("number_of_lessons"),
      dataIndex: "numberOfLessons",
      key: "numberOfLessons",
      render: (text) => <span>{text || 0}</span>,
      width: 100,
    },
    {
      title: t("action"),
      dataIndex: "id",
      key: "id",
      render: (text, item) => (
        <span>
          <Button disabled={!item.volunteerName}>
            <Link to={`/classes/${classData._id}/pairs/${text}`}>
              {t("view")}
            </Link>
          </Button>
        </span>
      ),
      width: 150,
    },
  ];

  const renderText = (text) => {
    return (
      <Popover content={text}>
        <span className="custom__text-1-line">{text}</span>
      </Popover>
    );
  };

  return (
    <div className="class-detail__pairs-table">
      <Row>
        <Col span={12} className="class-detail__pairs-table--title">
          {t("pairs_table")}
        </Col>
        <Col span={12} className="class-detail__pairs-table--option-button">
          {addNewStudent ? null : (
            <Button
              onClick={() => setAddNewStudent(true)}
              type="primary"
              disabled={!unRegisterStudents.length}
            >
              {t("register_pairs_for_student")} (
              {getArrayLength(unRegisterStudents)})
            </Button>
          )}
        </Col>
      </Row>
      {addNewStudent ? (
        <RegisterPairForNewStudent
          pairsTeaching={classData.pairsTeaching}
          setAddNewStudent={setAddNewStudent}
          classData={classData}
          fetchClassData={fetchClassData}
        />
      ) : (
        <div>
          <Row>
            <Col>
              {t("number_of_unregister_student")}:{" "}
              {getArrayLength(unRegisterStudents)}
            </Col>
            <Col>
              {t("number_of_waiting_student")}:{" "}
              {getArrayLength(waittingStudent)}
            </Col>
          </Row>
          {getArrayLength(dataSource) ? (
            <Table
              columns={columns}
              dataSource={dataSource}
              rowClassName={(record) =>
                `pair-list__table--${
                  record.volunteerName ? "active" : "deactive"
                }-row`
              }
            />
          ) : (
            <TableNodata />
          )}
        </div>
      )}
    </div>
  );
}

export default PairList;
