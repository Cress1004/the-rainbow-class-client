import React from "react";
import "../schedule.scss";
import { STUDENT, SUPER_ADMIN } from "../../../common/constant";
import PermissionDenied from "../../Error/PermissionDenied";
import StudentTimesheet from "./StudentTimesheet";
import VolunteerTimesheet from "./VolunteerTimesheet";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";

function Dashboard(props) {
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;

  if (userRole && userRole.role === STUDENT) {
    return <StudentTimesheet userId={userId} />;
  }

  if (userRole && userRole.subRole === SUPER_ADMIN) {
    return <PermissionDenied />;
  }

  return <VolunteerTimesheet userId={userId} />;
}

export default Dashboard;
