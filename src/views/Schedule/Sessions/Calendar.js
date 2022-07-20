import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { setColorForClass } from "../../../common/function";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import {
  transformEventOfLesson,
  transformScheduleTimeData,
} from "../../../common/transformData";
import {
  INTERVIEW_SCHEDULE,
  LESSON_SCHEDULE,
  STUDENT,
} from "../../../common/constant";
import useFetchAllClasses from "../../../hook/Class/useFetchAllClasses";

const localizer = momentLocalizer(moment);
function MyCalendar(props) {
  const { data, userRole, t } = props;
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
            <span className="custom__label">{t("interviewer_name")}:</span>{" "}
            {event.interviewerName}
          </p>
          <p>
            <span className="custom__label">{t("email")}: </span>
            {event.email}
          </p>
          <p>
            <span className="custom__label">{t("phone_number")}:</span>{" "}
            {event.phoneNumber}
          </p>
          <p>
            <span className="custom__label">{t("time")}: </span>
            {transformScheduleTimeData(event.time)}
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
            <span className="custom__label"> {t("lesson_name")}: </span>
            {event.lessonTitle}
          </p>
          <p>
            <span className="custom__label">{t("time")}:</span>{" "}
            {transformScheduleTimeData(event.time)}
          </p>
          <p>
            <span className="custom__label">{t("person_in_charge")}: </span>
            {event.personInCharge}
          </p>
          <Link
            to={`/classes/${event.classId}/lessons/${event.lessonId}`}
            className="show-lesson-detail"
          >
            {t("detail")}
          </Link>
          {userRole?.isAdmin || userRole?.role === STUDENT ? null : (
            <Link
              to={`/classes/${event.classId}?tab=report`}
              className="redirect-to-report"
            >
              {t("add_report")}
            </Link>
          )}
        </>
      );
  };

  const EventComponent = ({ event }) => (
    <div>
      <Popover
        title={<span className="custom__label">{event.title}</span>}
        trigger="click"
        placement="topLeft"
        content={content(event)}
      >
        {event.title}
      </Popover>
    </div>
  );

  return (
    <div>
      {events && classColors.length ? (
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
      ) : null}
    </div>
  );
}

export default MyCalendar;
