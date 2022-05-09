import {
  Button,
  Col,
  DatePicker,
  Form,
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
import TableNodata from "../../NoData/TableNodata";
const { MonthPicker } = DatePicker;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

function TeachByClassReportList(props) {
  const { t, currentUserData, classData, currentVolunteerData, lessons } =
    props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  const [myReport, setMyReport] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [addReport, setAddReport] = useState(false);
  const [lessonAndAchievement, setLessonAndAchievement] = useState([]);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );

  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    localStorage.setItem("report-current-month", month);
    if (myReport && !checkAdminRole(currentUserData.userRole))
      fetchReportsByVolunteer(currentVolunteerData?._id, month);
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
      localStorage.setItem("report-current-month", month);
      if (myReport) {
        fetchReportsByVolunteer(currentVolunteerData?._id, month);
      } else {
        fetchReportsByClass(classData?._id, month);
        fetchLessonsAndAchievement(classData?._id, month);
      }
      return myReport;
    });
  };

  const isAdmin = checkAdminRole(currentUserData?.userRole);

  useEffect(() => {
    if (!localStorage.getItem("report-current-month")) {
      localStorage.setItem("report-current-month", currentMonth);
    }
    setMyReport(isAdmin ? false : true);
    fetchReportsByVolunteer(currentVolunteerData?._id, month);
    fetchLessonsAndAchievement(classData?._id, month);
    fetchReportsByClass(classData?._id, month);
  }, [currentVolunteerData, classData, isAdmin]);

  const transformDataSourceMyReports = (myReports) => {
    let sum = 0;
    if (getArrayLength(myReports)) {
      const result = myReports.map((item, index) => {
        sum += item.achievement.point;
        return {
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
        };
      });
      result.push({
        lessonName: t("average"),
        point: sum / getArrayLength(myReports),
      });
      return result;
    }
  };

  const fixedColumns = [
    {
      title: t("student_name"),
      dataIndex: "name",
      fixed: true,
      width: 250,
    },
    {
      title: t("average"),
      dataIndex: "average",
      fixed: true,
      width: 100,
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

  const showCommentDetail = (currentLesson) => (
    <Form {...layout} name="control-hooks">
      <Form.Item label={t("created_by")}>
        {currentLesson?.createdBy.user.name}
      </Form.Item>
      <Form.Item label={t("created_time")}>
        {transformDate(currentLesson.created_at)}
      </Form.Item>
      <Form.Item label={t("lesson_description")}>
        {currentLesson?.lessonDescription}
      </Form.Item>
      <Form.Item label={t("comment")}>
        {currentLesson?.achievement?.comment}
      </Form.Item>
    </Form>
  );

  if (getArrayLength(lessonAndAchievement)) {
    lessonAndAchievement.map((lesson) => {
      fixedColumns.push({
        title: (
          <Popover content={transfromLessonDetail(lesson.lesson)}>
            {transformDate(lesson.lesson.schedule.time.date)}
            {/* <br />
            <div className="report-list__show-comment-button">
              <Button onClick={() => handleShowComment(lesson.lesson)}>
                <Icon type="plus-circle" />
              </Button>
            </div> */}
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
            <div>
              {currentLesson ? (
                <div>
                  <span>
                    {currentLesson ? currentLesson.achievement.point : "-"}
                  </span>
                  <Popover
                    content={showCommentDetail(currentLesson)}
                    title={t("report_detail")}
                    trigger="[click]"
                    // className="report-list__report-detail"
                    overlayStyle={{
                      width: "700px",
                    }}
                  >
                    {" "}
                    <Icon type="snippets" />
                  </Popover>
                </div>
              ) : (
                <span>
                  {currentLesson ? currentLesson.achievement.point : "-"}
                </span>
              )}
            </div>
          );
        },
      });
    });
  }

  const avgScore = (achievementArray) => {
    let sum = 0;
    console.log(achievementArray);
    achievementArray.forEach((item) => {
      sum += item.achievement.point;
    });
    return sum / getArrayLength(achievementArray).toFixed(2);
  };

  let fixedData = [];
  if (getArrayLength(allReports)) {
    fixedData = allReports?.map((item) => ({
      key: `${item?._id}`,
      name: item?.student?.user?.name,
      achievement: item?.achievement,
      comment: item?.comment,
      average: getArrayLength(item?.achievement)
        ? avgScore(item.achievement)
        : "-",
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
                {currentUserData.userRole.isAdmin ? null : (
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
                )}
              </Col>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: "10px" }}>
                    {t("select_month")}
                  </span>
                  <MonthPicker
                    onChange={(date, dateString) => changeMonth(dateString)}
                    defaultValue={moment(month, FORMAT_MONTH_STRING)}
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
            {checkAdminRole(currentUserData.userRole) ? (
              <>
                {getArrayLength(fixedData) ? (
                  <Table
                    className="report-list__all-achievement-table"
                    columns={getArrayLength(fixedData) > 0 ? fixedColumns : []}
                    dataSource={fixedData}
                    pagination={false}
                    scroll={{ x: 1000, y: 500 }}
                    bordered
                  />
                ) : (
                  <TableNodata />
                )}
              </>
            ) : (
              <>
                {myReport ? (
                  <>
                    {getArrayLength(myReports) ? (
                      <Table
                        columns={columns}
                        dataSource={transformDataSourceMyReports(myReports)}
                        rowClassName={(record, index) =>
                          index === getArrayLength(myReports)
                            ? "report-list__avg-row"
                            : ""
                        }
                      />
                    ) : (
                      <TableNodata />
                    )}
                  </>
                ) : (
                  <>
                    {getArrayLength(fixedColumns) ? (
                      <Table
                        className="report-list__all-achievement-table"
                        columns={
                          getArrayLength(fixedColumns) > 1 ? fixedColumns : []
                        }
                        dataSource={
                          getArrayLength(fixedColumns) > 1 ? fixedData : []
                        }
                        pagination={false}
                        scroll={{ x: 1000, y: 500 }}
                        bordered
                      />
                    ) : (
                      <TableNodata />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TeachByClassReportList;
