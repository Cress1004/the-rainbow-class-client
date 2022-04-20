import { COMMON_DATA_API } from "../config";
import api from "./api";

const getLocation = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${COMMON_DATA_API}/location`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getDistricts = async (provinceId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/province/${provinceId}/get-districts`,
      data: { provinceId: provinceId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getWards = async (provinceId, districtId) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/district/${districtId}/get-wards`,
      data: { provinceId: provinceId, districtId: districtId },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getStudentTypes = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${COMMON_DATA_API}/student-types`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addStudentType = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/add-student-type`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteStudentType = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/student-types/${id}/delete`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getSubjects = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${COMMON_DATA_API}/subjects`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addSubject = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/add-subject`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteSubject = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/subjects/${id}/delete`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getGrades = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${COMMON_DATA_API}/grades`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addGrade = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/add-grade`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteGrade = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/grades/${id}/delete`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getSemesters = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${COMMON_DATA_API}/semesters`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addSemester = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/add-semester`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteSemester = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${COMMON_DATA_API}/semesters/${id}/delete`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  getLocation,
  getStudentTypes,
  addStudentType,
  deleteStudentType,
  getDistricts,
  getWards,
  getSubjects,
  addSubject,
  deleteSubject,
  getGrades,
  addGrade,
  deleteGrade,
  getSemesters,
  addSemester,
  deleteSemester,
};
