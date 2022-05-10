import { Col, DatePicker, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import VolunteerReportTableRender from "./VolunteerReportTableRender";

const { MonthPicker } = DatePicker;

function AllReportOneToOneTeaching(props) {
  const { t, classData } = props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );

  const changeMonth = (month) => {
    localStorage.setItem("report-current-month", month);
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
  };

  const renderVolunteer = (volunteers) => (
    <div className="report-list">
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
      {volunteers?.map((volunteer) => (
        <VolunteerReportTableRender volunteer={volunteer} t={t} month={month} />
      ))}
    </div>
  );
  return <div>{renderVolunteer(classData?.volunteers)}</div>;
}

export default AllReportOneToOneTeaching;
