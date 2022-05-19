import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchSemesters() {
  const [semesters, setSemesters] = useState([]);
  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemesters()
    if (data.success) {
      setSemesters(data.semesters);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);
  return semesters;
}
