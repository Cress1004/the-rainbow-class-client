import { VOLUNTEER_API } from "../config";
import api from "./api";

const addVolunteer = async (values) => {
  try {
    const response = await api({
      method: "POST",
      url: `${VOLUNTEER_API}/add-volunteer`,
      data: values,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getVolunteers = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${VOLUNTEER_API}/get-volunteers`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getVolunteerData = async (volunteerId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${VOLUNTEER_API}/${volunteerId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editVolunteer = async (valueToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${VOLUNTEER_API}/${valueToSend._id}/edit`,
      data: valueToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const deleteVolunteer = async (volunteerId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${VOLUNTEER_API}/${volunteerId}/delete`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getCurrentVolunteer = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${VOLUNTEER_API}/get-current-volunteer`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export {
  addVolunteer,
  getVolunteers,
  getVolunteerData,
  editVolunteer,
  deleteVolunteer,
  getCurrentVolunteer,
};
