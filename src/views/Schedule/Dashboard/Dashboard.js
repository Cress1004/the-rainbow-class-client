import React from "react";
import "../schedule.scss";
import { STUDENT, VOLUNTEER } from "../../../common/constant";
import AdminDashboard from "./AdminDashboard";
import PermissionDenied from "../../../components/custom/Error/PermissionDenied";
import StudentTimesheet from "./StudentTimesheet";
import VolunteerTimesheet from "./VolunteerTimesheet";
import { useTranslation } from "react-i18next";
import { getCurrentUserUserData } from "../../../common/function";

function Dashboard(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const currentUserData = getCurrentUserUserData();
  const userRole = currentUserData.userRole;

  if (userRole && userRole.role === STUDENT) {
    return <StudentTimesheet userId={userId} t={t} userRole={userRole}/>;
  }

  if (userRole && userRole.isAdmin) {
    return <AdminDashboard t={t} userRole={userRole} />;
  }

  if (userRole && !userRole.isAdmin && userRole.role === VOLUNTEER)
    return <VolunteerTimesheet userId={userId} t={t}/>;
  return <PermissionDenied />;
}

export default Dashboard;
