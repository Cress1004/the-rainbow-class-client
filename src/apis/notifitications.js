import { NOTIFICATION_API } from "../config";
import api from "./api";

const getNotifications = async (limit) => {
  try {
    const response = await api({
      method: "GET",
      url: `${NOTIFICATION_API}/get-notifications`,
      params: {
        limit,
      },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const markAllAsRead = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${NOTIFICATION_API}/mark-all-as-read`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { getNotifications, markAllAsRead };
