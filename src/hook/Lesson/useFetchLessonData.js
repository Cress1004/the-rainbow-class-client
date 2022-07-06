/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchLessonData(classId, lessonId) {
  const [lessonData, setLessonData] = useState([]);
  const fetchLessonData = async () => {
    const data = await apis.lessons.getLessonData(classId, lessonId);
    if (data.success) {
      const lessonInfo = data.lessonData;
      setLessonData({
        _id: data._id,
        scheduleId: lessonInfo.schedule._id,
        teachOption: lessonInfo.schedule.teachOption,
        linkOnline: lessonInfo.schedule.linkOnline,
        title: lessonInfo.title,
        description: lessonInfo.description,
        address: lessonInfo.schedule.address,
        time: lessonInfo.schedule.time,
      });
      setLessonData((lessonData) => {
        return lessonData;
      });
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, []);
  return lessonData;
}
