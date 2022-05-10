import { Button, message, DatePicker, Table, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import PairDetail from "../PairSessions/PairDetail";
import AddReport from "./AddReport";
import moment from "moment";
import {
  getArrayLength,
  transformDate,
  transformScheduleTimeData,
} from "../../../common/transformData";
import "./report.scss";
import { checkAdminRole } from "../../../common/checkRole";
import AllReportOneToOneTeaching from "./AllReportOneToOneTeaching";
import TableNodata from "../../NoData/TableNodata";
import MyReportOneToOneTeaching from "./MyReportOneToOneTeaching";

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

  return (
    <div>
    
    </div>
  );
}

export default ReportList;
