import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { setColorForClass } from "../../../common/function";
import { useTranslation } from "react-i18next";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import {
  transformEventOfLesson,
  transformScheduleTimeData,
} from "../../../common/transformData";
import { INTERVIEW_SCHEDULE, LESSON_SCHEDULE } from "../../../common/constant";
import useFetchAllClasses from "../../../../hook/Class/useFetchAllClasses";

const localizer = momentLocalizer(moment);
function MyCalendar(props) {
  const { t } = useTranslation();
  const { data } = props;
  const events = data.map((item) => transformEventOfLesson(item));
  const [classColors, setClassColors] = useState([]);
  const classes = useFetchAllClasses();

  useEffect(() => {
    const colors = setColorForClass(classes);
    setClassColors(colors);
  }, [classes]);

  const content = (event) => {
    if (event.scheduleType === INTERVIEW_SCHEDULE)
      return (
        <>
          <p>
            {t("interviewer_name")}: {event.interviewerName}
          </p>
          <p>
            {t("email")}: {event.email}
          </p>
          <p>
            {t("phone_number")}: {event.phoneNumber}
          </p>
          <p>
            {t("time")}: {transformScheduleTimeData(event.time)}
          </p>
          <Link to={`/cv/${event.cvId}`} className="show-lesson-detail">
            {t("detail")}
          </Link>
        </>
      );
    if (event.scheduleType === LESSON_SCHEDULE)
      return (
        <>
          <p>
            {t("lesson_name")}: {event.lessonTitle}
          </p>
          <p>
            {t("time")}: {transformScheduleTimeData(event.time)}
          </p>
          <p>
            {t("person_in_charge")}: {event.personInCharge}
          </p>
          <Link
            to={`/classes/${event.classId}/lessons/${event.lessonId}`}
            className="show-lesson-detail"
          >
            {t("detail")}
          </Link>
        </>
      );
  };

  const EventComponent = ({ event }) => (
    <Popover
      title={event.title}
      trigger="click"
      placement="topLeft"
      content={content(event)}
    >
      {event.title}
    </Popover>
  );

  return (
    <div>
      {events && classColors.length && (
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          events={events}
          eventPropGetter={(event) => {
            const classId = event.classId;
            return {
              style: {
                backgroundColor: classColors.find(
                  (item) => item.classId === classId
                )?.color,
              },
            };
          }}
          popup={true}
          components={{
            event: EventComponent,
          }}
        />
      )}
    </div>
  );
}

export default MyCalendar;
