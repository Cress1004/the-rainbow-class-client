import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchSubjects() {
  const [subjects, setSubjects] = useState([]);
  const fetchSubjects = async () => {
    const data = await apis.commonData.getSubjects();
    if (data.success) {
      setSubjects(data.subjects);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
  return subjects;
}
