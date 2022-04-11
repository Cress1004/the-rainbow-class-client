import { Button, Row, Tabs } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import { checkAdminAndMonitorRole } from "../../../common/function";
import LessonList from "../Lesson/LessonList";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
const { TabPane } = Tabs;

function TeachByClassOptionDetail(props) {
  const { classData, currentUserData, userRole, classId, lessons } = props;
  const { t } = useTranslation();

  return (
    <div className="class-detail__info-area">
      <Tabs defaultActiveKey="1">
        <TabPane tab={t("basic_infor")} key="1">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        <TabPane tab={t("lessons")} key="2">
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
      </Tabs>
    </div>
  );
}

export default TeachByClassOptionDetail;
