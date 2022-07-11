import { Col, DatePicker, Row, Select, Switch } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import { FORMAT_MONTH_STRING } from "../../../common/constant";
import { checkNowOverSemesterTime } from "../../../common/function/checkTime";
import SemesterReport from "./SemesterReport";
import StudentReportTableRender from "./StudentReportTableRender";
import VolunteerReportTableRender from "./VolunteerReportTableRender";

const { MonthPicker } = DatePicker;
const { Option } = Select;

function AllReportOneToOneTeaching(props) {
  const { t, classData } = props;
  const currentMonth = moment(new Date()).format(FORMAT_MONTH_STRING);
  const [monthly, setMonthly] = useState(true);
  const [month, setMonth] = useState(
    localStorage.getItem("report-current-month")
      ? localStorage.getItem("report-current-month")
      : currentMonth
  );
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState(null);

  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemesters();
    if (data.success) {
      setSemesters(data.semesters);
    }
  };

  const handleChangeMonthly = () => {
    if (monthly) {
      fetchSemesters();
    } else {
      setMonth(moment(month).format(FORMAT_MONTH_STRING));
    }
    setMonthly(!monthly);
  };

  const handleChangeSemester = (value) => {
    const currentSemester = semesters.find((item) => item._id === value);
    setSemester(currentSemester);
  };

  const changeMonth = (month) => {
    localStorage.setItem("report-current-month", month);
    setMonth(moment(month).format(FORMAT_MONTH_STRING));
  };

  useEffect(() => {
    if (semesters.length) {
      const currentSem = semesters.find((item) =>
        checkNowOverSemesterTime(item.startDate, item.endDate)
      );
      setSemester(currentSem);
    }
  }, [semesters]);

  const renderVolunteer = (volunteers) => (
    <div className="report-list">
      <Row style={{ marginBottom: "20px" }}>
        <Col span={10}></Col>
        <Col span={6}>
          <Switch
            style={{ width: "150px", marginTop: "5px" }}
            checkedChildren={t("monthly_report")}
            unCheckedChildren={t("semester_report")}
            defaultChecked
            onChange={() => handleChangeMonthly()}
          />
        </Col>
        <Col span={8}>
          {" "}
          {monthly ? (
            <>
              <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
              <MonthPicker
                onChange={(date, dateString) => changeMonth(dateString)}
                defaultValue={moment(month, FORMAT_MONTH_STRING)}
                format={FORMAT_MONTH_STRING}
              />
            </>
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
          {volunteers?.map((volunteer) => (
            <VolunteerReportTableRender
              volunteer={volunteer}
              t={t}
              month={month}
              classData={classData}
            />
          ))}
        </>
      ) : (
        <SemesterReport t={t} semester={semester} classData={classData} />
      )}
    </div>
  );

  const renderStudent = (students) => (
    <div className="report-list">
      <Row style={{ marginBottom: "20px" }}>
        <Col span={10}></Col>
        <Col span={6}>
          <Switch
            style={{ width: "150px", marginTop: "5px" }}
            checkedChildren={t("monthly_report")}
            unCheckedChildren={t("semester_report")}
            defaultChecked
            onChange={() => handleChangeMonthly()}
          />
        </Col>
        <Col span={8}>
          {" "}
          {monthly ? (
            <>
              <span style={{ marginRight: "10px" }}>{t("select_month")}</span>
              <MonthPicker
                onChange={(date, dateString) => changeMonth(dateString)}
                defaultValue={moment(month, FORMAT_MONTH_STRING)}
                format={FORMAT_MONTH_STRING}
              />
            </>
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
          {students?.map((student) => (
            <StudentReportTableRender
              student={student}
              t={t}
              month={month}
              classData={classData}
            />
          ))}
        </>
      ) : (
        <SemesterReport t={t} semester={semester} classData={classData} />
      )}
    </div>
  );

  console.log(classData)

  return <div>{renderStudent(classData?.students)}</div>;
}

export default AllReportOneToOneTeaching;
