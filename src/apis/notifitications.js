import { NOTIFICATION_API } from "../config";
import api from "./api";

const getNotifications = async ({ search, query, fields, offset, limit, sort }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${NOTIFICATION_API}/get-notifications`,
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

export { getNotifications };
