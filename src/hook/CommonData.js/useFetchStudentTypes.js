import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchStudentTypes() {
  const [studentTypes, setStudentTypes] = useState([]);
  const fetchStudentTypes = async () => {
    const data = await apis.commonData.getStudentTypes();
    if (data.success) {
      setStudentTypes(data.studentTypes);
      setStudentTypes((studentTypes) => {
        return studentTypes;
      });
    }
  };

  useEffect(() => {
    fetchStudentTypes();
  }, []);
  return studentTypes;
}
