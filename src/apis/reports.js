import { REPORT_API } from "../config";
import api from "./api";

const addNewReport = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/new-report`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getReportByPairAndMonth = async (pairId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/get-reports-by-pair`,
      data: { pairId: pairId, month: month },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addTeachByClassReport = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/teach-by-class-new-report`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getReportByVolunteerAndMonth = async (volunteerId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/get-reports-by-volunteer`,
      data: { volunteerId: volunteerId, month: month },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getReportByClassAndMonth = async (classId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/get-reports-by-class`,
      data: { classId: classId, month: month },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getReportByStudentAndMonth = async (studentId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/get-reports-by-student`,
      data: { studentId: studentId, month: month },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  addNewReport,
  getReportByPairAndMonth,
  addTeachByClassReport,
  getReportByVolunteerAndMonth,
  getReportByClassAndMonth,
  getReportByStudentAndMonth
};
