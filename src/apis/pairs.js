import { PAIR_API } from "../config";
import api from "./api";

const getLessonsByPair = async (pairId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${PAIR_API}/${pairId}/lessons`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getPairById = async (pairId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${PAIR_API}/${pairId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
}


export { getLessonsByPair, getPairById };
