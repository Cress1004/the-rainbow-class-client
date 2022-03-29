import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchStudentByClass(classId) {
  const [studentData, setStudentData] = useState({});

  const fetchStudents = async () => {
    const data = await apis.classes.getStudentsByClass(classId);
    if (data.success) {
      setStudentData(data.studentData);
      setStudentData((studentData) => {
        return studentData;
      });
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  return studentData;
}
