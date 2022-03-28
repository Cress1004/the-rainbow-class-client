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

export {
  getLocation,
  getStudentTypes,
  addStudentType,
  deleteStudentType,
  getDistricts,
  getWards,
};
