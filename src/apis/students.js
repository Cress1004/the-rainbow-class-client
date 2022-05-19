import { STUDENT_API } from "../config";
import api from "./api";

const addStudent = async (values) => {
  try {
    const response = await api({
      method: "POST",
      url: `${STUDENT_API}/add-student`,
      data: values,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getStudents = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${STUDENT_API}/get-students`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getStudentData = async (studentId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${STUDENT_API}/${studentId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editStudent = async (valueToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${STUDENT_API}/${valueToSend._id}/edit`,
      data: valueToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteStudent = async (studentId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${STUDENT_API}/${studentId}/delete`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const updateOverview = async (valueToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${STUDENT_API}/${valueToSend.id}/update-overview`,
      data: {values: valueToSend},
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const changeStatus = async (studentId, data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${STUDENT_API}/${studentId}/change-status`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const studentFilter = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${STUDENT_API}/filter`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  addStudent,
  getStudents,
  getStudentData,
  editStudent,
  deleteStudent,
  updateOverview,
  changeStatus,
  studentFilter
};
