import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchGrades() {
  const [grades, setGrades] = useState([]);
  const fetchGrades = async () => {
    const data = await apis.commonData.getGrades();
    if (data.success) {
      setGrades(data.grades);
      setGrades((grades) => {
        return grades;
      });
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);
  return grades;
}
