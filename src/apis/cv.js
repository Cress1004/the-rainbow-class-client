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

const getAllCV = async ({ search, query, fields, offset, limit, sort }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CV_API}/get-all-cv`,
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

const getNotes = async (cvId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${CV_API}/${cvId}/get-all-notes`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addNote = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CV_API}/${data.cv}/add-note`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editNote = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CV_API}/edit-note`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteNote = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${CV_API}/delete/${id}`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  getCVData,
  getAllCV,
  updateCVStatus,
  getNumberOfCV,
  addNote,
  editNote,
  getNotes,
  deleteNote,
};
