import { SCHEDULE_API } from "../config";
import api from "./api";

const updatePersonInCharge = async (values) => {
  try {
    const response = await api({
      method: "POST",
      url: `${SCHEDULE_API}/${values.scheduleId}/update-person-incharge`,
      data: { values: values },
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

export { updatePersonInCharge };
