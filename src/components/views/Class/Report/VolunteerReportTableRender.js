/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, Icon, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";

function VolunteerReportTableRender(props) {
  const { volunteer, t, month, classData } = props;
  const [reportsByVolunteer, setReportsByVolunteer] = useState([]);
  const [icon, setIcon] = useState(false);
  const [pairData, setPairData] = useState({});

  useEffect(() => {
    fetchReportsByVolunteerAndMonth(volunteer?._id, month);
    fetchPairDataByVolunteer(classData?._id, volunteer?._id);
  }, [month]);

  const fetchReportsByVolunteerAndMonth = async (volunteerId, month) => {
    const data = await apis.reports.getReportByVolunteerAndMonth(
      volunteerId,
      month
    );
    if (data.success) {
      setReportsByVolunteer(data.reports);
    } else {
      message.error("Error!");
    }
  };

  const fetchPairDataByVolunteer = async (classId, volunteerId) => {
    const data = await apis.classes.getPairByVolunteer(classId, volunteerId);
    if (data.success) {
      setPairData(data.pairData);
    } else {
      alert(t("fail_to_get_class"));
    }
  };

  const onChangeIcon = (volunteerId) => {
    if (!icon) {
      fetchReportsByVolunteerAndMonth(volunteerId, month);
    }
    setIcon(!icon);
  };

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
      width: 75,
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
      width: 35,
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
          studentName: report.achievement.student.user.name,
          scheduleTime: transformScheduleTimeData(
            report.achievement.lesson.schedule.time
          ),
          createdTime: transformDate(report.created_at),
          subjectName: report.subject.title,
          point: report.achievement.point,
          comment: report.achievement.comment,
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
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
        {volunteer.user.name}
      </span>
      <Icon
        type={icon ? "down-circle" : "right-circle"}
        onClick={() => onChangeIcon(volunteer._id)}
        style={{ marginLeft: "10px" }}
      />
      <div style={{ textAlign: "right" }}>{`${
        pairData?.student
          ? `${t("student_name")}: ${pairData?.student?.user?.name}`
          : ""
      }`}</div>
      {icon && getArrayLength(reportsByVolunteer) ? (
        <Table
          rowClassName={(record, index) =>
            index === getArrayLength(reportsByVolunteer)
              ? "report-list__avg-row"
              : ""
          }
          className="report-list__my-report"
          columns={columns}
          dataSource={transformDataSource(reportsByVolunteer)}
          pagination={false}
        />
      ) : null}
      <Divider />
    </div>
  );
}

export default VolunteerReportTableRender;
