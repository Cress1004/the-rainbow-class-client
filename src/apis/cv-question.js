import { QUESTION_API } from "../config";
import api from "./api";

const getQuestions = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${QUESTION_API}`,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const addQuestion = async (data) => {
  try {
    const response = await api({
      method: "POST",
      url: `${QUESTION_API}/add`,
      data: data,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const editQuestion = async (data) => {
    try {
      const response = await api({
        method: "POST",
        url: `${QUESTION_API}/${data._id}/edit`,
        data: data,
      });
      return response;
    } catch (error) {
      return error.response?.data;
    }
  };

const deleteQuestion = async (id) => {
  try {
    const response = await api({
      method: "POST",
      url: `${QUESTION_API}/delete/${id}`,
      data: { id: id },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { getQuestions, addQuestion, deleteQuestion, editQuestion };
