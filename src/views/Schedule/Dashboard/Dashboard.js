import React, { useEffect, useState } from "react";
import "../schedule.scss";
import { STUDENT, VOLUNTEER } from "../../../common/constant";
import AdminDashboard from "./AdminDashboard";
import PermissionDenied from "../../../components/custom/Error/PermissionDenied";
import StudentTimesheet from "./StudentTimesheet";
import VolunteerTimesheet from "./VolunteerTimesheet";
import { useTranslation } from "react-i18next";
import { getCurrentUserUserData } from "../../../common/function";
import { getMonthRangeBetweenTwoDate } from "../../../common/function/checkTime";
import apis from "../../../apis";

function Dashboard(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const currentUserData = getCurrentUserUserData();
  const userRole = currentUserData.userRole;
  const currentDate = new Date();
  const [classes, setClasses] = useState([]);
 
  const [monthRange, setMonthRange] = useState(
    getMonthRangeBetweenTwoDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const data = await apis.classes.getAllClasses();
    if (data.success) {
      setClasses(data.classes);
    }
  };

  if (userRole && userRole.role === STUDENT) {
    return (
      <StudentTimesheet
        userId={userId}
        t={t}
        userRole={userRole}
        monthRange={monthRange}
        setMonthRange={setMonthRange}
        classes={classes}
      />
    );
  }

  if (userRole && userRole.isAdmin) {
    return (
      <AdminDashboard
        t={t}
        userRole={userRole}
        monthRange={monthRange}
        setMonthRange={setMonthRange}
        classes={classes}
      />
    );
  }

  if (userRole && !userRole.isAdmin && userRole.role === VOLUNTEER)
    return (
      <VolunteerTimesheet
        userId={userId}
        t={t}
        monthRange={monthRange}
        setMonthRange={setMonthRange}
        classes={classes}
      />
    );
  return <PermissionDenied />;
}

export default Dashboard;
