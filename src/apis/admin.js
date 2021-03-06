import { ADMIN_API } from "../config";
import api from "./api";

const getListAdmin = async ({ search, query, fields, offset, limit, sort }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${ADMIN_API}/get-admin`,
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

export { getListAdmin };
