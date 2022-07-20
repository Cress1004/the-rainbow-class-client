import { Button, Col, DatePicker, message, Row, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import apis from "../../../apis";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";
import TableNodata from "../../../components/custom/NoData/TableNodata";
import PairDetail from "../PairSessions/PairDetail";
import AddReport from "./AddReport";
import "./report.scss";

const { MonthPicker } = DatePicker;

function MyReportOneToOneTeaching(props) {
  const {
    t,
    pairData,
    currentUserData,
    isCurrentVolunteerBelongCurrentPair,
    currentVolunteerData,
    classData,
    lessons,
  } = props;

  const [addReport, setAddReport] = useState(false);
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );

  const fetchReportsByPair = async (pairId, month) => {
    const data = await apis.reports.getReportByPairAndMonth(pairId, month);
    if (data.success) {
      setReports(data.reports);
    } else {
      message.error("Error!");
    }
  };

  useEffect(() => {
    fetchReportsByPair(pairData?._id, currentMonth);
  }, [pairData]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeMonth = (month) => {
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
    localStorage.setItem("report-current-month", month);
    fetchReportsByPair(pairData._id, month);
  };

  const transformDataSource = (reports) => {
    let sum = 0;
    if (getArrayLength(reports)) {
      const result = reports.map((item, index) => {
        sum += item.achievement.point;
        return {
          key: index,
          id: item._id,
          lessonName: item?.achievement?.lesson?.title,
          studentName: item?.achievement?.student?.user?.name,
          scheduleTime: transformScheduleTimeData(
            item?.achievement?.lesson?.schedule?.time
          ),
          createdTime: transformDate(item.created_at),
          subjectName: item?.subject?.title,
          point: item?.achievement?.point,
          comment: item?.achievement?.comment,
        };
      });
      result.push({
        lessonName: t("average"),
        point: (sum / getArrayLength(reports)).toFixed(2),
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

  return (
    <div>
      {addReport ? (
        <AddReport
          classData={classData}
          currentVolunteerData={currentVolunteerData}
          pairData={pairData}
          lessons={lessons}
          t={t}
          setAddReport={setAddReport}
          fetchReportsByPair={fetchReportsByPair}
          month={month}
        />
      ) : (
        <div className="report-list">
          <Row>
            <Col span={15}></Col>
            <Col span={6}>
              {" "}
              <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
              <MonthPicker
                onChange={(date, dateString) => changeMonth(dateString)}
                defaultValue={moment(month, FORMAT_MONTH_STRING)}
                format={FORMAT_MONTH_STRING}
              />
            </Col>
            <Col span={3}>
              {isCurrentVolunteerBelongCurrentPair ? (
                <Button
                  type="primary"
                  className="report-list__add-report-button"
                  onClick={() => setAddReport(true)}
                >
                  {t("add_report")}
                </Button>
              ) : null}
            </Col>
          </Row>
          <PairDetail
            pairData={pairData}
            t={t}
            currentUserData={currentUserData}
          />
          {getArrayLength(reports) ? (
            <Table
              rowClassName={(record, index) =>
                index === getArrayLength(reports) ? "report-list__avg-row" : ""
              }
              className="report-list__my-report"
              columns={columns}
              dataSource={transformDataSource(reports)}
            />
          ) : (
            <TableNodata />
          )}
        </div>
      )}
    </div>
  );
}

export default MyReportOneToOneTeaching;
