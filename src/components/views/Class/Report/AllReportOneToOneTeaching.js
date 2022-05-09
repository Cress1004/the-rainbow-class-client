import { Divider, Icon, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";

function AllReportOneToOneTeaching(props) {
  const {
    t,
    month,
    reportsByVolunteer,
    setReportsByVolunteer,
    icons,
    setIcons,
  } = props;

  const fetchReportsByVolunteerAndMonth = async (volunteerId, month) => {
    const data = await apis.reports.getReportByVolunteerAndMonth(
      volunteerId,
      month
    );
    if (data.success) {
      const report = reportsByVolunteer;
      const currentVolunteer = reportsByVolunteer.findIndex(
        (item) => item.key === volunteerId
      );
      report[currentVolunteer].reports = data.reports;
      setReportsByVolunteer(report);
    } else {
      message.error("Error!");
    }
  };

  const onChangeIcon = (volunteerId) => {
    setIcons(
      icons.map((item) => {
        if (item.key === volunteerId) {
          item.showDetail = !item.showDetail;
          if (item.showDetail) {
            fetchReportsByVolunteerAndMonth(volunteerId, month);
          }
        }
        return item;
      })
    );
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
        point: sum / getArrayLength(reports),
      });
      return result;
    }
  };

  const renderVolunteer = () => (
    <div>
      {icons.map((icon) => {
        const currentVolunteerReport = reportsByVolunteer.find(
          (item) => item.key === icon.key
        );
        return (
          <div>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              {icon.volunteer.user.name}
            </span>
            <Icon
              type={icon?.showDetail ? "down-circle" : "right-circle"}
              onClick={() => onChangeIcon(icon.key)}
              style={{ marginLeft: "10px" }}
            />
            {icon?.showDetail &&
            getArrayLength(currentVolunteerReport?.reports) ? (
              <Table
                rowClassName={(record, index) =>
                  index === getArrayLength(currentVolunteerReport?.reports)
                    ? "report-list__avg-row"
                    : ""
                }
                className="report-list__my-report"
                columns={columns}
                dataSource={transformDataSource(
                  currentVolunteerReport?.reports
                )}
                pagination={false}
              />
            ) : null}
            <Divider />
          </div>
        );
      })}
    </div>
  );
  return <div>{renderVolunteer()}</div>;
}

export default AllReportOneToOneTeaching;
