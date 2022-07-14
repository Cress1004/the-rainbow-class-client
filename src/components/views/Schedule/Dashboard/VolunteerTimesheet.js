import React, { useEffect, useState } from "react";
import MyCalendar from "../Sessions/Calendar";
import { useTranslation } from "react-i18next";
import apis from "../../../../apis";

function VolunteerTimesheet(props) {
  const { t } = useTranslation();
  const { userId } = props;
  const [schedule, setSchedule] = useState([]);

  const fetchCurrentUserSchedule = async () => {
    const data = await apis.users.getCurrentUserSchedule();
    if (data.success) setSchedule(data.schedule);
  };

  useEffect(() => {
    fetchCurrentUserSchedule();
  }, [t, userId]);

  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
      <MyCalendar data={schedule} userId={userId} t={t}/>
    </div>
  );
}

export default VolunteerTimesheet;
