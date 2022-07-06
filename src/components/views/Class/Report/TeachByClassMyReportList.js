import {
  Button,
  Col,
  DatePicker,
  message,
  Row,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import TeachByClassAddReport from "./TeachByClassAddReport";
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
const { MonthPicker } = DatePicker;

function TeachByClassMyReportList(props) {
  const { t, classData, currentVolunteerData, lessons } = props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);

  const [myReports, setMyReports] = useState([]);
  const [addReport, setAddReport] = useState(false);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );

  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    localStorage.setItem("report-current-month", month);
    fetchReportsByVolunteer(currentVolunteerData?._id, month);
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

  useEffect(() => {
    if (!localStorage.getItem("report-current-month")) {
      localStorage.setItem("report-current-month", currentMonth);
    }
    fetchReportsByVolunteer(currentVolunteerData?._id, month);
  }, [currentVolunteerData, classData]); // eslint-disable-line react-hooks/exhaustive-deps

  const transformDataSourceMyReports = (myReports) => {
    // let sum = 0;
    if (getArrayLength(myReports)) {
      const result = myReports.map((item, index) => {
        // sum += item.achievement.point;
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
      //   result.push({
      //     lessonName: t("average"),
      //     point: sum / getArrayLength(myReports),
      //   });
      return result;
    }
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
    <div className="report-list__header">
      {addReport ? (
        <TeachByClassAddReport
          classData={classData}
          currentVolunteerData={currentVolunteerData}
          lessons={lessons}
          t={t}
          setAddReport={setAddReport}
          fetchReportsByVolunteer={fetchReportsByVolunteer}
          month={month}
        />
      ) : (
        <>
          <Row>
            <Col span={15}></Col>
            <Col span={6}>
              <div>
                <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
                <MonthPicker
                  onChange={(date, dateString) => changeMonth(dateString)}
                  defaultValue={moment(month, FORMAT_MONTH_STRING)}
                  format={FORMAT_MONTH_STRING}
                />
              </div>
            </Col>
            <Col span={3}>
              <Button
                type="primary"
                className="report-list__add-report-button"
                onClick={() => setAddReport(true)}
                style={{ width: "150px" }}
              >
                {t("add_report")}
              </Button>
            </Col>
          </Row>
          {getArrayLength(myReports) ? (
            <Table
              className="report-list__all-achievement-table"
              columns={columns}
              dataSource={transformDataSourceMyReports(myReports)}
              //   rowClassName={(record, index) =>
              //     index === getArrayLength(myReports) ? "report-list__avg-row" : ""
              //   }
            />
          ) : (
            <TableNodata />
          )}
        </>
      )}
    </div>
  );
}

export default TeachByClassMyReportList;
