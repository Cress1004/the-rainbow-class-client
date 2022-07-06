
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchStudentData(studentId) {
  const [studentData, setStudentData] = useState({});

  const fetchStudentData = async () => {
    const data = await apis.student.getStudentData(studentId);
    if (data.success) {
      const student = data.studentData;
      setStudentData({
        id: student._id,
        name: student.user.name,
        email: student.user.email,
        gender: student.user.gender,
        parentName: student.parentName,
        studentTypes: student.studentTypes.map((type) => type._id),
        image: student.user.image,
        phoneNumber: student.user.phoneNumber,
        address: student.user.address,
        class: student.user.class?._id,
        overview: data.overview,
        interest: data.interest,
        character: data.character,
      });
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return studentData;
}
