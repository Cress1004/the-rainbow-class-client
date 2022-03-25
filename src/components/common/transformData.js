import moment from "moment";
import {
  WEEKDAY,
  FORMAT_TIME_SCHEDULE,
  FORMAT_DATE,
  LESSON_SCHEDULE,
  INTERVIEW_SCHEDULE,
} from "./constant";

export function transformAddressData(data) {
  return data && data.address
    ? `${data.description ? `${data.description},` : ''} ${data.address.ward.name}, ${data.address.district.name}, ${data.address.province.name}`
    : "";
}

export function transformStudentTypes(data) {
  return data ? data.map((item) => item.title).join(", ") : "";
}

export function getArrayLength(data) {
  return data ? data.length : 0;
}

export function transformStudentTypesToArray(data) {
  return data ? data.map((item) => item.title) : [];
}

export function transformScheduleTime(time) {
  return time ? moment(new Date(time), FORMAT_TIME_SCHEDULE) : undefined;
}

export function transformSchedule(data) {
  return data
    ? {
        key: data.key,
        dayOfWeek: WEEKDAY.find((item) => item.key === data.dayOfWeek).text,
        endTime: data.endTime,
        startTime: data.startTime,
      }
    : undefined;
}

export function transformLessonTime(data) {
  return data
    ? {
        key: data.key,
        dayOfWeek: WEEKDAY.find((item) => item.key === data.dayOfWeek).text,
        endTime: moment(new Date(data.endTime)).format(FORMAT_TIME_SCHEDULE),
        startTime: moment(new Date(data.startTime)).format(
          FORMAT_TIME_SCHEDULE
        ),
        date: moment(new Date(data.date)).format(FORMAT_DATE),
      }
    : undefined;
}

export function transformLessonTimeToString(data) {
  const newData = transformLessonTime(data);
  return newData
    ? `${newData.date} ${newData.startTime} - ${newData.endTime}`
    : "";
}

export function convertTimeStringToMoment(string) {
  return string ? moment(string, FORMAT_TIME_SCHEDULE) : undefined;
}

export function convertDateStringToMoment(string) {
  return string ? moment(string, FORMAT_DATE) : undefined;
}

export function transformEventOfLesson(data) {
  const time = data?.schedule?.time;
  const scheduleType = data?.schedule?.scheduleType;
  if (time) {
    if (scheduleType === LESSON_SCHEDULE)
      return {
        scheduleType: scheduleType,
        title: data.class?.name,
        lessonTitle: data.title,
        className: data.class?.name,
        classId: data.class?._id,
        lessonId: data._id,
        personInCharge: data.schedule.personInCharge
          ? data.schedule.personInCharge.name
          : "unset",
        time: time,
        start: new Date(`${time.date} ${time.startTime}`),
        end: new Date(`${time.date} ${time.endTime}`),
      };
    if (scheduleType === INTERVIEW_SCHEDULE)
      return {
        scheduleType: scheduleType,
        title: `Phỏng vấn - ${data.class?.name}`,
        interviewerName: data.userName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        cvId: data._id,
        classId: data.class._id,
        personInCharge: data.schedule.personInCharge
          ? data.schedule.personInCharge.name
          : "unset",
        time: time,
        start: new Date(`${time.date} ${time.startTime}`),
        end: new Date(`${time.date} ${time.endTime}`),
      };
  }
}

export function transformScheduleTimeData(time) {
  return `${time.date} ${time.startTime} - ${time.endTime}`;
}
