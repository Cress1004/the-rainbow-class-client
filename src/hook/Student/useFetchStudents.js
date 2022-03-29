import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchStudents() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const data = await apis.student.getStudents();
    if (data.success) {
      setStudents(data.students);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return students;
}
