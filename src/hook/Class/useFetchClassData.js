import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchClassData(classId) {
  const [classData, setClassData] = useState([]);
  const fetchClassData = async () => {
    const data = await apis.classes.getClassData(classId);
    if (data.success) {
      const classInfo = data.classData;
      setClassData({
        _id: classInfo._id,
        name: classInfo.name,
        description: classInfo.description,
        address: classInfo.address,
        studentTypes: classInfo.studentTypes,
        defaultSchedule: classInfo.defaultSchedule,
        volunteers: classInfo.volunteers,
        classMonitor: classInfo.classMonitor,
        subClassMonitor: classInfo.subClassMonitor,
        students: classInfo.students,
      });
      setClassData((classData) => {
        return classData;
      });
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);
  return classData;
}
