import { CLASS_API } from "../config";
import api from "./api";

const addLesson = async (classId, dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/add-lesson`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getLessonData = async (classId, lessonId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/lessons/${lessonId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editLesson = async (classId, lessonId, dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/lessons/${lessonId}/edit`,
      data: { lessonData: dataToSend },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteLesson = async (classId, lessonId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/lessons/${lessonId}/delete`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const assignSchedule = async (classId, lessonId, scheduleId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/lessons/${lessonId}/assign`,
      data: { scheduleId: scheduleId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const unassignSchedule = async (classId, lessonId, scheduleId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/lessons/${lessonId}/unassign`,
      data: { scheduleId: scheduleId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getLessons = async (classId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/get-lessons`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getLessonByClassAndMonth = async (classId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/get-lessons-achievement-by-class-and-month`,
      data: { classId: classId, month: month },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  addLesson,
  getLessonData,
  editLesson,
  deleteLesson,
  assignSchedule,
  unassignSchedule,
  getLessons,
  getLessonByClassAndMonth
};
