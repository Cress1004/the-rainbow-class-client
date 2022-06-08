import { CV_API } from "../config";
import api from "./api";

const getCVData = async (cvId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CV_API}/${cvId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getAllCV = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${CV_API}/get-all-cv`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getNumberOfCV = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${CV_API}/get-number-of-cv`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const updateCVStatus = async (values) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CV_API}/${values.cvId}/update-status`,
      data: values,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { getCVData, getAllCV, updateCVStatus, getNumberOfCV };
