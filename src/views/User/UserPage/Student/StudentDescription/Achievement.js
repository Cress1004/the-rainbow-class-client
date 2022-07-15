/* eslint-disable react-hooks/exhaustive-deps */
import {
  Col,
  DatePicker,
  Row,
  Select,
  Switch,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMAT_MONTH_STRING } from "../../../../../common/constant";
import moment from "moment";
import {
  getArrayLength,
  transformScheduleTimeData,
} from "../../../../../common/transformData";
import apis from "../../../../../apis";
import { checkNowOverSemesterTime, getMonthRangeBetweenTwoDate } from "../../../../../common/function/checkTime";
import TableNodata from "../../../../../components/custom/NoData/TableNodata";
const { MonthPicker } = DatePicker;
const { Option } = Select;

function Achievement(props) {
  const { id } = props;
  const { t } = useTranslation();
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);
  const [achievement, setAchievement] = useState();
  const [monthly, setMonthly] = useState(true);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );
  const [achievementSemester, setAchievementSemester] = useState();

  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    fetchStudentAchievement(id, month);
  }, [id, month]);

  useEffect(() => {
    if (semesters.length) {
      const currentSem = semesters.find((item) =>
        checkNowOverSemesterTime(item.startDate, item.endDate)
      );
      setSemester(currentSem);
    }
  }, [semesters]);

  useEffect(() => {
    const monthRange = getMonthRangeBetweenTwoDate(
      semester?.startDate,
      semester?.endDate
    );
    fetchStudentAchievementSemester(id, monthRange);
  }, [id, semester]);

  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemesters();
    if (data.success) {
      setSemesters(data.semesters);
    }
  };

  const fetchStudentAchievement = async (studentId) => {
    const data = await apis.achievement.getStudentAchievement(studentId, month);
    if (data.success) {
      setAchievement(data.achievement);
    } else {
      alert(t("fail to get studentAchievement"));
    }
  };

  const fetchStudentAchievementSemester = async (studentId, monthRange) => {
    const data = await apis.achievement.getStudentAchievementSemester(studentId, monthRange);
    if (data.success) {
      setAchievementSemester(data.achievement);
    } else {
      alert(t("fail to get studentAchievement"));
    }
  };

  const handleChangeSemester = (value) => {
    const currentSemester = semesters.find((item) => item._id === value);
    setSemester(currentSemester);
  };

  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    localStorage.setItem("report-current-month", month);
    // fetchStudentAchievement(id, month);
  };

  const handleChangeMonthly = () => {
    if (monthly) {
      fetchSemesters();
      // fetchLessonAndAchievementBySemester(classData._id, semester)
    } else {
      fetchStudentAchievement(id, month);
    }
    setMonthly(!monthly);
  };

  const transformDataSource = (achievement) => {
    let sum = 0;
    let totalLessons = 0;
    if (getArrayLength(achievement)) {
      const result = achievement.map((item, index) => {
        if (item.point) {
          sum += item.point;
          totalLessons++;
        }
        return {
          key: index,
          id: item._id,
          lessonName: item?.lesson?.title,
          scheduleTime: transformScheduleTimeData(item?.lesson?.schedule?.time),
          subjectName: item?.subject?.title,
          point: item?.point,
          comment: item?.comment,
        };
      });
      result.push({
        lessonName: t("average"),
        point: (sum / totalLessons).toFixed(2),
      });
      return result;
    }
  };

  const columns = [
    {
      title: t("lesson_name"),
      dataIndex: "lessonName",
      key: "lessonName",
      render: (text) => <span>{text}</span>,
      width: 185,
    },
    {
      title: t("schedule_time"),
      dataIndex: "scheduleTime",
      key: "scheduleTime",
      render: (text, item) => <span>{text}</span>,
      width: 120,
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: (text) => <span>{text || "-"}</span>,
      width: 75,
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text || "-"}</span>,
      width: 500,
    },
  ];

  return (
    <div>
      <div className="report-list">
        <Row>
          <Col span={12}></Col>
          <Col span={4}>
            <Switch
              style={{ width: "150px", marginTop: "5px" }}
              checkedChildren={t("monthly_report")}
              unCheckedChildren={t("semester_report")}
              defaultChecked
              onChange={() => handleChangeMonthly()}
            />
          </Col>
          <Col span={8}>
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
            {getArrayLength(achievement) ? (
              <Table
                rowClassName={(record, index) =>
                  index === getArrayLength(achievement)
                    ? "report-list__avg-row"
                    : ""
                }
                className="report-list__my-report"
                columns={columns}
                dataSource={transformDataSource(achievement)}
                pagination={false}
              />
            ) : (
              <TableNodata />
            )}
          </>
        ) : (
          <>
            {" "}
            {getArrayLength(achievementSemester) ? (
              <Table
                rowClassName={(record, index) =>
                  index === getArrayLength(achievementSemester)
                    ? "report-list__avg-row"
                    : ""
                }
                className="report-list__my-report"
                columns={columns}
                dataSource={transformDataSource(achievementSemester)}
                pagination={false}
              />
            ) : (
              <TableNodata />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Achievement;
