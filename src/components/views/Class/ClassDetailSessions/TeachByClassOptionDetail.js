/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import apis from "../../../../apis";
import {
  checkAdminRole,
  checkCurrentMonitorBelongToCurrentClass,
  checkCurrentUserBelongToCurrentClass,
} from "../../../common/checkRole";
import { checkAdminAndMonitorRole } from "../../../common/function";
import LessonList from "../Lesson/LessonList";
import TeachByClassMyReportList from "../Report/TeachByClassMyReportList";
import TeachByClassReportList from "../Report/TeachByClassReportList";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
const { TabPane } = Tabs;

function TeachByClassOptionDetail(props) {
  const { classData, currentUserData, userRole, classId, lessons, defaultTab } =
    props;
  const [currentVolunteerData, setCurrentVolunteerData] = useState({});

  const fetchCurrentVolunteerData = async () => {
    const data = await apis.volunteer.getCurrentVolunteer();
    if (data.success) {
      setCurrentVolunteerData(data.volunteerData);
    } else {
      alert(t("fail_to_get_class"));
    }
  };
  useEffect(() => {
    fetchCurrentVolunteerData();
  }, []);

  const { t } = useTranslation();
  const handleChangeTab = (key) => {
    localStorage.setItem("defaultTab", key);
  };

  return (
    <div className="class-detail__info-area">
      <Tabs
        defaultActiveKey={defaultTab}
        onChange={(key) => handleChangeTab(key)}
      >
        <TabPane tab={t("basic_infor")} key="basic-infor">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        <TabPane tab={t("lessons")} key="lessons">
          {checkCurrentUserBelongToCurrentClass(currentUserData, classId) && (
            <div>
              {checkAdminAndMonitorRole(userRole) && (
                <Row>
                  <div className="class-detail__add-lesson">
                    <Button type="primary">
                      <Link to={`/classes/${classId}/lessons/add`}>
                        {t("add_lesson")}
                      </Link>
                    </Button>
                  </div>
                </Row>
              )}
              <LessonList classId={classId} lessons={lessons} classData={classData}/>
            </div>
          )}
        </TabPane>
        {checkAdminRole(currentUserData.userRole) ? null : (
          <TabPane tab={t("my_report")} key="my-report-list">
            <TeachByClassMyReportList
              classData={classData}
              t={t}
              lessons={lessons}
              currentVolunteerData={currentVolunteerData}
            />
          </TabPane>
        )}
        {checkCurrentMonitorBelongToCurrentClass(
          currentUserData,
          classData?._id
        ) ? (
          <TabPane tab={t("class_report_list")} key="class-report-list">
            <TeachByClassReportList classData={classData} t={t} />
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
}

export default TeachByClassOptionDetail;
