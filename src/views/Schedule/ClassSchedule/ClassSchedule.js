import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../schedule.scss";
import MyCalendar from "../Sessions/Calendar";
import apis from "../../../apis";
import { getMonthRangeBetweenTwoDate } from "../../../common/function/checkTime";

function ClassSchedule() {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [schedule, setSchedule] = useState([]);
  const currentDate = new Date();
  const [monthRange, setMonthRange] = useState(
    getMonthRangeBetweenTwoDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  );
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const data = await apis.classes.getAllClasses();
    if (data.success) {
      setClasses(data.classes);
    }
  };
  const fetchCurrentUserClassSchedule = async () => {
    const data = await apis.classes.getCurrentUserClassSchedule({monthRange: monthRange});
    if (data.success) {
      setSchedule(data.schedule);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchCurrentUserClassSchedule();
  }, [monthRange]);

  return (
    <div className="class-schedule">
      {schedule ? (
        <MyCalendar
          data={schedule}
          userId={userId}
          t={t}
          monthRange={monthRange}
          setMonthRange={setMonthRange}
          classes={classes}
        />
      ) : null}
    </div>
  );
}

export default ClassSchedule;
