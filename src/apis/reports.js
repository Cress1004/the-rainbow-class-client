import { REPORT_API } from "../config";
import api from "./api";

const addNewReport = async (dataToSend) => {
  try {
    const response = await api({
      method: "POST",
      url: `${REPORT_API}/new-report`,
      data: dataToSend,
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { addNewReport };
