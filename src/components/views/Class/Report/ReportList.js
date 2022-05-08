import { Button, Divider, message, DatePicker, Table, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import PairDetail from "../PairSessions/PairDetail";
import AddReport from "./AddReport";
import moment from "moment";
import {
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";
import "./report.scss";
import { checkAdminRole } from "../../../common/checkRole";
import AllReportOneToOneTeaching from "./AllReportOneToOneTeaching";

const { MonthPicker } = DatePicker;

function ReportList(props) {
  const {
    currentVolunteerData,
    currentUserData,
    classData,
    pairData,
    lessons,
    isCurrentVolunteerBelongCurrentPair,
    t,
    isAdmin,
    fetchPairDataByVolunteer,
  } = props;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);
  const [reports, setReports] = useState([]);
  const [addReport, setAddReport] = useState(false);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );
  const [reportsByVolunteer, setReportsByVolunteer] = useState([]);
  const [icons, setIcons] = useState([]);

  const fetchReportsByPair = async (pairId, month) => {
    const data = await apis.reports.getReportByPairAndMonth(pairId, month);
    if (data.success) {
      setReports(data.reports);
    } else {
      message.error("Error!");
    }
  };

  useEffect(() => {
    let iconsList = [];
    let reportList = [];

    classData.volunteers.map((volunteer) => {
      iconsList.push({
        key: volunteer._id,
        volunteer: volunteer,
        showDetail: false,
      });
      reportList.push({ key: volunteer._id });
    });
    setIcons(iconsList);
    setReportsByVolunteer(reportList);
  }, [classData]);

  useEffect(() => {
    if (!localStorage.getItem("report-current-month")) {
      localStorage.setItem("report-current-month", currentMonth);
    }
    if (isAdmin) {
    } else {
      fetchReportsByPair(pairData?._id, currentMonth);
    }
  }, [pairData]);

  const changeMonth = (month) => {
    localStorage.setItem("report-current-month", month);
    let iconsList = [];
    let reportList = [];

    classData.volunteers.map((volunteer) => {
      iconsList.push({
        key: volunteer._id,
        volunteer: volunteer,
        showDetail: false,
      });
      reportList.push({ key: volunteer._id });
    });
    setIcons(iconsList);
    setReportsByVolunteer(reportList);
    
    if (!isAdmin) fetchReportsByPair(pairData._id, month);
  };

  const dataSource = reports?.map((item, index) => ({
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
  }));

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
      <div className="report-list__title">
        {`${t("report")} - ${classData?.name}`}
      </div>
      {addReport ? (
        <AddReport
          classData={classData}
          currentVolunteerData={currentVolunteerData}
          pairData={pairData}
          lessons={lessons}
          t={t}
          setAddReport={setAddReport}
        />
      ) : (
        <div className="report-list">
          {/* <PairDetail
            pairData={pairData}
            t={t}
            currentUserData={currentUserData}
          /> */}
          {isCurrentVolunteerBelongCurrentPair ? (
            <Button
              type="primary"
              className="class-list__add-class-button"
              onClick={() => setAddReport(true)}
            >
              {t("add_report")}
            </Button>
          ) : null}
          <Row>
            <Col span={18}></Col>
            <Col span={6}>
              {" "}
              <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
              <MonthPicker
                onChange={(date, dateString) => changeMonth(dateString)}
                defaultValue={moment(month, FORMAT_MONTH_STRING)}
                format={FORMAT_MONTH_STRING}
              />
            </Col>
          </Row>
          <Row>
            {isAdmin ? (
              <AllReportOneToOneTeaching
                fetchPairDataByVolunteer={fetchPairDataByVolunteer}
                fetchReportsByPair={fetchReportsByPair}
                month={month}
                classData={classData}
                reportsByVolunteer={reportsByVolunteer}
                setReportsByVolunteer={setReportsByVolunteer}
                t={t}
                icons={icons}
                setIcons={setIcons}
              />
            ) : (
              <Table
                className="report-list__my-report"
                columns={columns}
                dataSource={dataSource}
              />
            )}
          </Row>
        </div>
      )}
    </div>
  );
}

export default ReportList;
