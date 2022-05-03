import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchAllLessonByClass(classId) {
  const [lessons, setLessons] = useState([]);
  const fetchLessons = async () => {
    const data = await apis.lessons.getLessons(classId);
    if (data.success) {
      setLessons(data.lessons);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);
  return lessons;
}
