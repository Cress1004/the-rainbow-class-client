import {
  Button,
  Col,
  DatePicker,
  Divider,
  Icon,
  message,
  Popover,
  Row,
  Switch,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import TeachByClassAddReport from "./TeachByClassAddReport";
import "./report.scss";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import moment from "moment";
import { checkAdminRole } from "../../../common/checkRole";
import apis from "../../../../apis";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";
const { MonthPicker } = DatePicker;

function TeachByClassReportList(props) {
  const { t, currentUserData, classData, currentVolunteerData, lessons } =
    props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  const [myReport, setMyReport] = useState(true);
  const [myReports, setMyReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [addReport, setAddReport] = useState(false);
  const [lessonAndAchievement, setLessonAndAchievement] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    if (myReport) fetchReportsByVolunteer(currentVolunteerData?._id, month);
    else {
      fetchReportsByClass(classData?._id, month);
      fetchLessonsAndAchievement(classData?._id, month);
    }
  };

  const fetchReportsByVolunteer = async (volunteerId, month) => {
    const data = await apis.reports.getReportByVolunteerAndMonth(
      volunteerId,
      month
    );
    if (data.success) {
      setMyReports(data.reports);
    } else {
      message.error("Error!");
    }
  };

  const fetchReportsByClass = async (classId, month) => {
    const data = await apis.reports.getReportByClassAndMonth(classId, month);
    if (data.success) {
      setAllReports(data.studentData);
    } else {
      message.error("Error!");
    }
  };
  const fetchLessonsAndAchievement = async (classId, month) => {
    const data = await apis.lessons.getLessonByClassAndMonth(classId, month);
    if (data.success) {
      setLessonAndAchievement(data.lessonsWithReport);
    } else {
      message.error("Error!");
    }
  };

  const handleChangeReportStatus = () => {
    setMyReport(!myReport);
    setMyReport((myReport) => {
      if (myReport) {
        fetchReportsByVolunteer(currentVolunteerData?._id, month);
      } else {
        console.log(month)
        fetchReportsByClass(classData?._id, month);
        fetchLessonsAndAchievement(classData?._id, month);
      }
      return myReport;
    });
  };

  useEffect(() => {
    if (myReport) {
      fetchReportsByVolunteer(currentVolunteerData?._id, month);
    } else {
      fetchLessonsAndAchievement(classData?._id, month);
      fetchReportsByClass(classData?._id, month);
    }
  }, [currentVolunteerData, classData]);

  const dataSourceMyReports = myReports?.map((item, index) => ({
    key: index,
    id: item._id,
    lessonName: item?.achievement?.lesson?.title,
    scheduleTime: transformScheduleTimeData(
      item?.achievement?.lesson?.schedule?.time
    ),
    studentName: item?.achievement?.student?.user?.name,
    createdTime: transformDate(item.created_at),
    point: item?.achievement?.point,
    comment: item?.achievement?.comment,
  }));

  const fixedColumns = [
    {
      title: t("student_name"),
      dataIndex: "name",
      fixed: true,
      width: 250,
    },
  ];

  const transfromLessonDetail = (lesson) => (
    <div>
      <p>
        {t("title")}: {lesson?.title}
      </p>
      <p>
        {t("time")}: {transformScheduleTimeData(lesson?.schedule?.time)}
      </p>
    </div>
  );

  if (getArrayLength(lessonAndAchievement)) {
    lessonAndAchievement.map((lesson) => {
      fixedColumns.push({
        title: (
          <Popover content={transfromLessonDetail(lesson.lesson)}>
            {transformDate(lesson.lesson.schedule.time.date)}
            <br />
            <Icon type="plus" />
          </Popover>
        ),
        dataIndex: `achievement`,
        key: lesson.lesson._id,
        minWidth: 30,
        maxWidth: 70,
        render: (record) => {
          var currentLesson = record.find(
            (item) => item?.achievement?.lesson?._id === lesson.lesson._id
          );
          return (
            <span>{currentLesson ? currentLesson.achievement.point : "-"}</span>
          );
        },
      });
    });
  }

  let fixedData = [];
  if (getArrayLength(allReports)) {
    fixedData = allReports?.map((item) => ({
      key: `${item?._id}`,
      name: item?.student?.user?.name,
      achievement: item?.achievement,
    }));
  }

  const columns = [
    {
      title: t("lesson_name"),
      dataIndex: "lessonName",
      key: "lessonName",
      render: (text) => <span>{text}</span>,
      width: 120,
    },
    {
      title: t("schedule_time"),
      dataIndex: "scheduleTime",
      key: "scheduleTime",
      render: (text, item) => <span>{text}</span>,
      width: 170,
    },
    {
      title: t("created_time"),
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text, item) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("student_name"),
      dataIndex: "studentName",
      key: "studentName",
      render: (text) => <span>{text}</span>,
      width: 120,
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: (text) => <span>{text || "-"}</span>,
      width: 50,
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text || "-"}</span>,
      width: 400,
    },
  ];

  return (
    <div>
      <div className="report-list__header">
        <div className="report-list__title">
          {`${t("report")} - ${classData?.name}`}
        </div>
        {addReport ? (
          <TeachByClassAddReport
            classData={classData}
            currentVolunteerData={currentVolunteerData}
            lessons={lessons}
            t={t}
            setAddReport={setAddReport}
          />
        ) : (
          <>
            <Row>
              <Col span={12}>
                {" "}
                <Switch
                  checkedChildren={t("my_report")}
                  unCheckedChildren={t("class_report")}
                  defaultChecked
                  onClick={handleChangeReportStatus}
                  style={{
                    marginLeft: "300px",
                    marginBottom: "10px",
                    width: "150px",
                  }}
                />
              </Col>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: "10px" }}>
                    {t("select_month")}
                  </span>
                  <MonthPicker
                    onChange={(date, dateString) => changeMonth(dateString)}
                    defaultValue={moment(new Date(), FORMAT_MONTH_STRING)}
                    format={FORMAT_MONTH_STRING}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {checkAdminRole(currentUserData.userRole) ? null : (
                <Button
                  type="primary"
                  className="report-list__add-report-button"
                  onClick={() => setAddReport(true)}
                  style={{ width: "150px" }}
                >
                  {t("add_report")}
                </Button>
              )}
            </Row>

            {myReport ? (
              <>
                {" "}
                <Table columns={columns} dataSource={dataSourceMyReports} />
              </>
            ) : (
              <>
                {" "}
                <Table
                  className="report-list__all-achievement-table"
                  columns={fixedColumns}
                  dataSource={fixedData}
                  pagination={false}
                  scroll={{ x: 1000, y: 500 }}
                  bordered
                />
              </>
            )}
            <Divider />
          </>
        )}
      </div>
    </div>
  );
}

export default TeachByClassReportList;
