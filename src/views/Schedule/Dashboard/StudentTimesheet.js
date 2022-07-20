import React, { useEffect, useState } from "react";
import MyCalendar from "../Sessions/Calendar";
import { useTranslation } from "react-i18next";
import apis from "../../../apis";
function StudentTimesheet(props) {
  const { t } = useTranslation();
  const { userId, userRole } = props;
  const [schedule, setSchedule] = useState([]);

  const fetchCurrentUserClassSchedule = async () => {
    const data = await apis.classes.getCurrentUserClassSchedule();
    if (data.success) {
      setSchedule(data.schedule);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchCurrentUserClassSchedule();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
      <MyCalendar data={schedule} userId={userId} t={t} userRole={userRole} />
    </div>
  );
}

export default StudentTimesheet;
