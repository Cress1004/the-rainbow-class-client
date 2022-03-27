import React from "react";
import { useTranslation } from "react-i18next";
import "./master-setting.scss";
import StudentType from "./SubSetting/StudentType.js/StudentType";
import { checkAdminRole } from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";

function Mastersetting(props) {
  const { t } = useTranslation();
  const userData = useFetchCurrentUserData();
  if (userData && !checkAdminRole(userData.userRole)) {
    return <PermissionDenied />;
  }
  return (
    <div className="mastersetting">
      <div className="mastersetting__title">{t("master_setting")}</div>
      <StudentType />
    </div>
  );
}

export default Mastersetting;
