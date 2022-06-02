import { ANSWER_API } from "../config";
import api from "./api";

const getAnswerWithCV = async (cvId) => {
  try {
    const response = await api({
      method: "GET",
      url: `${ANSWER_API}/${cvId}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { getAnswerWithCV };
