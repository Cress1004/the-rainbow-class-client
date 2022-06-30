import { ACHIEVEMENT_API } from "../config";
import api from "./api";

const getStudentAchievement = async (studentId, month) => {
  try {
    const response = await api({
      method: "POST",
      url: `${ACHIEVEMENT_API}/get-achievement-student/`,
      data: {month: month, studentId: studentId}
    });
    return response;
  } catch (error) {
    return error.response?.data;
  }
};

const getStudentAchievementSemester = async (studentId, monthRange) => {
    try {
        const response = await api({
          method: "POST",
          url: `${ACHIEVEMENT_API}/get-achievement-student-semester/`,
          data: {monthRange: monthRange, studentId: studentId}
        });
        return response;
      } catch (error) {
        return error.response?.data;
      } 
}

export { getStudentAchievement, getStudentAchievementSemester };
