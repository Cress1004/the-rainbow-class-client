import { Button, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import apis from "../../../../apis";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import { checkAdminAndMonitorRole } from "../../../common/function";
import LessonList from "../Lesson/LessonList";
import TeachByClassReportList from "../Report/TeachByClassReportList";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
const { TabPane } = Tabs;

function TeachByClassOptionDetail(props) {
  const {
    classData,
    currentUserData,
    userRole,
    classId,
    lessons,
    defaultTab,
    setDefaultTab,
  } = props;
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
              <LessonList classId={classId} lessons={lessons} />
            </div>
          )}
        </TabPane>
        <TabPane tab={t("report")} key="report">
          <TeachByClassReportList
            classData={classData}
            currentUserData={currentUserData}
            t={t}
            lessons={lessons}
            currentVolunteerData={currentVolunteerData}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default TeachByClassOptionDetail;
