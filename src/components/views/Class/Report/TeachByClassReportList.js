import {
  Col,
  DatePicker,
  Form,
  Icon,
  message,
  Popover,
  Row,
  Select,
  Switch,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import "./report.scss";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import moment from "moment";
import apis from "../../../../apis";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";
import TableNodata from "../../NoData/TableNodata";
import _function from "../../../common/function";
import {
  checkNowOverSemesterTime,
} from "../../../common/function/checkTime";
import SemesterReport from "./SemesterReport";
const { MonthPicker } = DatePicker;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const { Option } = Select;

function TeachByClassReportList(props) {
  const { t, classData } = props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  const [allReports, setAllReports] = useState([]);
  const [lessonAndAchievement, setLessonAndAchievement] = useState([]);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );
  const [monthly, setMonthly] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState(null);

  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    localStorage.setItem("report-current-month", month);
    fetchReportsByClass(classData?._id, month);
    fetchLessonsAndAchievement(classData?._id, month);
  };

  const handleChangeMonthly = () => {
    if (monthly) {
      fetchSemesters();
      // fetchLessonAndAchievementBySemester(classData._id, semester)
    } else {
      fetchLessonsAndAchievement(classData._id, month);
    }
    setMonthly(!monthly);
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

  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemesters();
    if (data.success) {
      setSemesters(data.semesters);
    }
  };

  const handleChangeSemester = (value) => {
    const currentSemester = semesters.find((item) => item._id === value);
    setSemester(currentSemester);
  };

  useEffect(() => {
    if (!localStorage.getItem("report-current-month")) {
      localStorage.setItem("report-current-month", currentMonth);
    }
    fetchLessonsAndAchievement(classData?._id, month);
    fetchReportsByClass(classData?._id, month);
  }, [classData]);

  useEffect(() => {
    if (semesters.length) {
      const currentSem = semesters.find((item) =>
        checkNowOverSemesterTime(item.startDate, item.endDate)
      );
      setSemester(currentSem);
    }
  }, [semesters]);

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

  return (
    <div className="report-list__header">
      <Row>
        <Col span={14}></Col>
        <Col span={4}>
          <Switch
            style={{ width: "150px", marginTop: "5px" }}
            checkedChildren={t("monthly_report")}
            unCheckedChildren={t("semester_report")}
            defaultChecked
            onChange={() => handleChangeMonthly()}
          />
        </Col>
        <Col span={6}>
          {monthly ? (
            <div>
              <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
              <MonthPicker
                onChange={(date, dateString) => changeMonth(dateString)}
                defaultValue={moment(month, FORMAT_MONTH_STRING)}
                format={FORMAT_MONTH_STRING}
              />
            </div>
          ) : (
            <div>
              <span style={{ marginRight: "10px" }}>
                {t("select_semester")}
              </span>
              <Select
                style={{ width: "200px" }}
                placeholder={t("select_semester")}
                value={semester?.title}
                onChange={handleChangeSemester}
              >
                {semesters.map((option) => (
                  <Option key={option._id} value={option._id}>
                    {option.title}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </Col>
      </Row>
      {monthly ? (
        <>
          {" "}
          {getArrayLength(lessonAndAchievement) ? (
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
        <SemesterReport
          t={t}
          semester={semester}
          fetchLessonsAndAchievement={fetchLessonsAndAchievement}
          classData={classData}
        />
      )}
    </div>
  );
}

export default TeachByClassReportList;
