import { CLASS_API } from "../config";
import api from "./api";

const addClass = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/add-class`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getAllClasses = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/get-list-class-with-name`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getAllClassesWithParams = async ({
  search,
  query,
  fields,
  offset,
  limit,
  sort,
}) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/get-all-classes`,
      params: {
        search,
        query,
        fields,
        offset,
        limit,
        sort,
      },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getNumberOfClasses = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/get-number-of-classes`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteClass = async (id) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${id}/delete`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editClass = async (classId, dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/edit`,
      data: { classData: dataToSend },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getClassData = async (classId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const submitCommentStudent = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/comment-student`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const setMonitor = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${dataToSend.classId}/set-monitor`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getAdminMonitor = async (classId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/get-admin-monitor`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getCurrentUserClassSchedule = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/my-class-schedules`,
      data: data
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getClassSchedules = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/get-class-schedules`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getListClassWithName = async (dataToSend) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/get-list-class-with-name`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getStudentsByClass = async (classId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/get-students`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getPairsByClass = async (classId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CLASS_API}/${classId}/get-pairs`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addNewPairTeaching = async (classId, value) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/pairs/new`,
      data: value,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const setPairVolunteer = async (classId, data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/pairs/${data.pairId}/set-volunteer`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getPairByVolunteer = async (classId, volunteerId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/pairs/get-pair-data`,
      data: { volunteerId: volunteerId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getPairByStudent = async (classId, studentId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CLASS_API}/${classId}/pairs/get-pair-data-by-student`,
      data: { studentId: studentId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  addClass,
  getAllClasses,
  deleteClass,
  editClass,
  getClassData,
  submitCommentStudent,
  setMonitor,
  getAdminMonitor,
  getCurrentUserClassSchedule,
  getClassSchedules,
  getListClassWithName,
  getStudentsByClass,
  getPairsByClass,
  addNewPairTeaching,
  setPairVolunteer,
  getPairByVolunteer,
  getNumberOfClasses,
  getAllClassesWithParams,
  getPairByStudent
};
