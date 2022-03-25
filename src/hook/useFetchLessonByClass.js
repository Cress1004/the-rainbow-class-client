import Axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useFetchLessonByClass(classId) {
  const [lessonData, setLessonData] = useState({});
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    Axios.post(`/api/classes/${classId}/get-lessons`, {
      classId: classId, userId: userId
    }).then((response) => {
      const res = response.data;
      if (res.success) {
        setLessonData(res.lessons);
        setLessonData((lessonData) => {
          return lessonData;
        });
      } else if (!res.success) {
        alert(res.message);
      } 
    });
  }, [t, classId, userId]);
  return lessonData;
}
