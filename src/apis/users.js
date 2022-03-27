import { USER_API } from "../config";
import api from "./api";

const getCurrentUser = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${USER_API}/current-user`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getCurrentUserSchedule = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${USER_API}/my-schedule`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getCurrentUserProfile = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${USER_API}/profile`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editProfile = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      data: dataToSend,
      url: `${USER_API}/profile/edit`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const changeAvatar = async (newAvtLink) => {
  try {
    const response = await api({
      method: "POST",
      data: { newAvtLink },
      url: `${USER_API}/change-avatar`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const resetPassword = async (email) => {
  try {
    const response = await api({
      method: "POST",
      data: { resetEmail: email },
      url: `${USER_API}/reset-password`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const changePassword = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      data: dataToSend,
      url: `${USER_API}/change-password`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const setNewPassword = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      data: dataToSend,
      url: `${USER_API}/set-new-password`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
}

export {
  getCurrentUser,
  getCurrentUserSchedule,
  getCurrentUserProfile,
  changeAvatar,
  resetPassword,
  changePassword,
  setNewPassword,
  editProfile
};
