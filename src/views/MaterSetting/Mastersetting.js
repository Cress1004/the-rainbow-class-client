import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./master-setting.scss";
import StudentType from "./SubSetting/StudentType.js/StudentType";
import { checkAdminRole } from "../../common/checkRole";
import PermissionDenied from "../../components/custom/Error/PermissionDenied";
import useFetchCurrentUserData from "../../hook/User/useFetchCurrentUserData";
import { Tabs } from "antd";
import Subject from "./SubSetting/Subject/Subject";
import Grade from "./SubSetting/Grade/Grade";
import Semester from "./SubSetting/Semester/Semester";

const { TabPane } = Tabs;

function Mastersetting(props) {
  const { t } = useTranslation();
  const userData = useFetchCurrentUserData();
  const [tab, setTab] = useState("1");

  const onChangeTab = (key) => {
    setTab(key);
  };

  if (userData && !checkAdminRole(userData.userRole)) {
    return <PermissionDenied />;
  }

  return (
    <div className="mastersetting">
      <div className="mastersetting__title">{t("master_setting")}</div>
      <Tabs defaultActiveKey="4" onChange={(key) => onChangeTab(key)}>
        <TabPane tab={t("student_type")} key="1">
          <StudentType />
        </TabPane>
        <TabPane tab={t("subject")} key="2">
          <Subject />
        </TabPane>
        <TabPane tab={t("grade")} key="3">
          <Grade />
        </TabPane>
        <TabPane tab={t("semester")} key="4">
          <Semester />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Mastersetting;
