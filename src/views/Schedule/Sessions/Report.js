/* eslint-disable react-hooks/exhaustive-deps */
import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apis from "../../../apis";
import { TEACHING_OPTIONS } from "../../../common/classConstant";
import { CV_STATUS } from "../../../common/constant";

function Report(props) {
  const { t } = props;
  const [classData, setClassData] = useState({});
  const [cvData, setCVData] = useState({});
  const [volunteerCountData, setVolunteerCountData] = useState();
  const [studentCountData, setStudentCountData] = useState();

  const fetchVolunteerCountData = async () => {
    const data = await apis.volunteer.getVolunteerCount();
    if (data.success) {
      setVolunteerCountData(data.volunteerCountData);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const fetchStudentCountData = async () => {
    const data = await apis.student.getStudentCountData();
    if (data.success) {
      setStudentCountData(data.studentCountData);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const fetchNumberOfClasses = async () => {
    const data = await apis.classes.getNumberOfClasses();
    if (data.success) setClassData(data.classData);
  };

  const fetchNumberOfCV = async () => {
    const data = await apis.cv.getNumberOfCV();
    if (data.success) setCVData(data.cvData);
  };

  useEffect(() => {
    fetchNumberOfClasses();
    fetchNumberOfCV();
    fetchVolunteerCountData();
    fetchStudentCountData();
  }, []);

  return (
    <div className="report">
      <Row>
        <Col span={5} className={"report-box report-box__class"}>
          {t("total_classes")}
          <p className="report-box__number">
            <Link to={`classes`} className={"text-in-table-row"}>
              <span style={{ color: "white" }}>
                {classData?.numberOfAllClases || 0} {t("class")}
              </span>
            </Link>
          </p>
          <ul className="no-bullets">
            <li style={{ color: "white" }}>
              <Link
                to={`classes?offset=1&search=&query=%7B"teachingOption":1%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {classData?.numberOfOnlineClasses || 0} {t("class")}{" "}
                  {TEACHING_OPTIONS[1].vie}
                </span>
              </Link>
            </li>
            <li style={{ color: "white" }}>
              <Link
                to={`classes?offset=1&search=&query=%7B"teachingOption":0%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {classData?.numberOfOfflineClasses || 0} {t("class")}{" "}
                  {TEACHING_OPTIONS[0].vie}
                </span>
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={1}></Col>
        <Col span={5} className={"report-box report-box__volunteer"}>
          {t("total_volunteers")}
          <p className="report-box__number">
            <Link to={`volunteers`} className={"text-in-table-row"}>
              <span style={{ color: "white" }}>
                {volunteerCountData?.numberOfVolunteers || 0} {t("TNV")}
              </span>
            </Link>
          </p>
          <ul className="no-bullets">
            <li>
              <Link to={`admin`} className={"text-in-table-row"}>
                <span style={{ color: "white" }}>
                  {volunteerCountData?.numberOfAdmins || 0} {t("admin")}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={`volunteers?offset=1&search=&query=%7B"isActive":"false"%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {volunteerCountData?.numberOfInactiveVolunteer || 0} {t("account")} {t("inactive")}
                </span>
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={1}></Col>
        <Col span={5} className={"report-box report-box__student"}>
          {t("total_students")}
          <p className="report-box__number">
            <Link to={`students`} className={"text-in-table-row"}>
              <span style={{ color: "white" }}>
                {studentCountData?.numberOfStudent || 0} {t("student")}
              </span>
            </Link>
          </p>
          <ul className="no-bullets">
            <li>
              <Link
                to={`students?offset=1&search=&query=%7B%22studyingStatus%22:%22studying%22%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {studentCountData?.studyingStudent || 0} {t("HS")} {t("number_of_studing")}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={`students?offset=1&search=&query=%7B%22studyingStatus%22:%22retiremented%22%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {studentCountData?.retiredStudent || 0} {t("HS")} {t("number_of_retirement")}
                </span>
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={1}></Col>
        <Col span={5} className={"report-box report-box__cv"}>
          {t("total_cvs")}
          <p className="report-box__number">
            <Link to={`cv`} className={"text-in-table-row"}>
              <span style={{ color: "white" }}>
                {cvData?.totalCV || 0} {t("cv")}
              </span>
            </Link>
          </p>
          <ul className="no-bullets">
            <li>
              <Link
                to={`cv?offset=1&search=&query=%7B"status":0%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {cvData?.pendingCV || 0} {t("cv")} {CV_STATUS[0].text}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={`cv?offset=1&search=&query=%7B"status":1%7D`}
                className={"text-in-table-row"}
              >
                <span style={{ color: "white" }}>
                  {cvData?.waitingCV || 0} {t("cv")} {CV_STATUS[1].text}
                </span>
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default Report;
