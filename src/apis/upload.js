import { UPLOAD_API } from "../config";
import api from "./api";
const uploadAvatar = async (formData) => {
  try {
    const response = await api({
      method: "POST",
      url: `${UPLOAD_API}/upload-avatar`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};


export {
  uploadAvatar
};
