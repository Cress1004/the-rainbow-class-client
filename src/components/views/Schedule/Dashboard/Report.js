import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import useFetchStudents from "../../../../hook/Student/useFetchStudents";
import useFetchVolunteers from "../../../../hook/Volunteer/useFetchVolunteers";
import { CV_STATUS } from "../../../common/constant";

function Report(props) {
  const { t } = props;
  const [classData, setClassData] = useState({});
  const [cvData, setCVData] = useState({});
  const students = useFetchStudents();
  const volunteers = useFetchVolunteers();
  const inactiveVolunteer = volunteers?.filter((item) => !item?.user?.isActive);
  const admin = volunteers?.filter((item) => item?.isAdmin);

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
  }, []);

  return (
    <div className="report">
      <Row>
        <Col span={5} className={"report-box report-box__class"}>
          {t("total_classes")}
          <p className="report-box__number">
            {classData?.numberOfAllClases || 0} {t("class")}
          </p>
          <ul className="no-bullets">
            <li>
              {t("online")}: ({classData?.numberOfOnlineClasses || 0}{" "}
              {t("class")})
            </li>
            <li>
              {t("offline")}: ({classData?.numberOfOfflineClasses || 0}{" "}
              {t("class")})
            </li>
          </ul>
        </Col>
        <Col span={5} className={"report-box report-box__volunteer"}>
          {t("total_volunteers")}
          <p className="report-box__number">
            {volunteers.length || 0} {t("TNV")}
          </p>
          <ul className="no-bullets">
            <li>
              {t("admin")} ({admin.length || 0} {t("QTV")})
            </li>
            <li>
              {t("inactive")} ({inactiveVolunteer.length || 0} {t("account")})
            </li>
          </ul>
        </Col>
        <Col span={5} className={"report-box report-box__student"}>
          {t("total_students")}
          <p className="report-box__number">
            {students.length || 0} {t("student")}
          </p>
          <ul className="no-bullets">
            <li>
              {t("number_of_unregister")} ({classData.totalUnpairStudent || 0} {t("HS")})
            </li>
            <li>
              {t("number_of_waiting")} ({classData.totalUnpairStudent || 0} {t("HS")})
            </li>
          </ul>
        </Col>
        <Col span={5} className={"report-box report-box__cv"}>
          {t("total_cvs")}
          <p className="report-box__number">{cvData?.totalCV || 0}</p>
          <ul className="no-bullets">
            <li>
              {CV_STATUS[0].text} ({cvData?.pendingCV || 0})
            </li>
            <li>
              {CV_STATUS[1].text} ({cvData?.waitingCV || 0})
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default Report;
