/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Icon, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../apis";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";

function StudentReportTableRender(props) {
  const { student, t, month, classData } = props;
  const [reportsByStudent, setReportsByStudent] = useState([]);
  const [icon, setIcon] = useState(false);
  const [pairData, setPairData] = useState({});

  useEffect(() => {
    fetchReportsByStudentAndMonth(student?._id, month);
    fetchPairDataByStudent(classData?._id, student?._id);
  }, [month]);

  const fetchReportsByStudentAndMonth = async (studentId, month) => {
    const data = await apis.reports.getReportByStudentAndMonth(
      studentId,
      month
    );
    if (data.success) {
      setReportsByStudent(data.reports);
    } else {
      message.error("Error!");
    }
  };

  const fetchPairDataByStudent = async (classId, studentId) => {
    const data = await apis.classes.getPairByStudent(classId, studentId);
    if (data.success) {
      setPairData(data.pairData);
    } else {
      alert(t("fail_to_get_class"));
    }
  };

  const onChangeIcon = (studentId) => {
    if (!icon) {
      fetchReportsByStudentAndMonth(studentId, month);
    }
    setIcon(!icon);
  };

  const columns = [
    {
      title: t("lesson_name"),
      dataIndex: "lessonName",
      key: "lessonName",
      render: (text) => <span>{text}</span>,
      width: 175,
    },
    {
      title: t("schedule_time"),
      dataIndex: "scheduleTime",
      key: "scheduleTime",
      render: (text, item) => <span>{text}</span>,
      width: 115,
    },
    {
      title: t("created_time"),
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text, item) => (
        <span>
          {text}
          <br />
          {item.createdBy}
        </span>
      ),
      width: 120,
    },
    {
      title: t("subject"),
      dataIndex: "subjectName",
      key: "subjectName",
      render: (text, item) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: (text) => <span>{text || "-"}</span>,
      width: 70,
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text || "-"}</span>,
      width: 300,
    },
  ];

  const transformDataSource = (reports) => {
    let sum = 0;
    if (getArrayLength(reports)) {
      const result = reports.map((report) => {
        sum += report.achievement.point;
        return {
          lessonName: report.achievement.lesson.title,
          studentName: report.achievement.student?.user.name,
          scheduleTime: transformScheduleTimeData(
            report.achievement.lesson.schedule.time
          ),
          createdTime: transformDate(report.created_at),
          subjectName: report.subject?.title,
          point: report.achievement.point,
          comment: report.achievement.comment,
          createdBy: report.createdBy?.user?.name,
        };
      });
      result.push({
        lessonName: t("average"),
        point: (sum / getArrayLength(reports)).toFixed(2),
      });
      return result;
    }
  };

  return (
    <div>
      {" "}
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
        {`${t("student")}: ${student.user.name}`}
      </span>
      <Icon
        type={icon ? "down-circle" : "right-circle"}
        onClick={() => onChangeIcon(student._id)}
        style={{ marginLeft: "10px" }}
      />
      <div style={{ textAlign: "right" }}>{`${
        pairData?.volunteer
          ? `${t("volunteer_name")}: ${
              pairData.volunteer?.user?.name || t("unset")
            }`
          : ""
      }`}</div>
      {icon && getArrayLength(reportsByStudent) ? (
        <Table
          rowClassName={(record, index) =>
            index === getArrayLength(reportsByStudent)
              ? "report-list__avg-row"
              : ""
          }
          className="report-list__my-report"
          columns={columns}
          dataSource={transformDataSource(reportsByStudent)}
          pagination={false}
        />
      ) : null}
      <Divider />
    </div>
  );
}

export default StudentReportTableRender;
