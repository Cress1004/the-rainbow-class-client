import React, { useEffect, useState } from "react";
import Axios from "axios";
import MyCalendar from "../Sessions/Calendar";
import { useTranslation } from "react-i18next";
function StudentTimesheet(props) {
  const { t } = useTranslation();
  const { userId } = props;
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState([]);
  useEffect(() => {
    Axios.post(`/api/classes/my-class-schedules`, { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data;
          setSchedule(data.schedule);
          setClassData(data.classData);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, userId]);

  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
      <MyCalendar data={schedule} userId={userId} />
    </div>
  );
}

export default StudentTimesheet;
