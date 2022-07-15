import React from "react";
import "../schedule.scss";
import { STUDENT, VOLUNTEER } from "../../../common/constant";
import AdminDashboard from "../Sessions/AdminDashboard";
import PermissionDenied from "../../Error/PermissionDenied";
import StudentTimesheet from "./StudentTimesheet";
import VolunteerTimesheet from "./VolunteerTimesheet";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import { useTranslation } from "react-i18next";

function Dashboard(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;

  if (userRole && userRole.role === STUDENT) {
    return <StudentTimesheet userId={userId} />;
  }

  if (userRole && userRole.isAdmin) {
    return <AdminDashboard t={t} isAdmin={userRole.isAdmin} />;
  }

  if (userRole && !userRole.isAdmin && userRole.role === VOLUNTEER)
    return <VolunteerTimesheet userId={userId} />;
  return <PermissionDenied />;
}

export default Dashboard;
