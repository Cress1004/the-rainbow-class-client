import { useState, useEffect } from "react";
import { useParams } from "react-router";
import apis from "../../apis";

export default function useFetchCVData() {
  const [cvData, setCVData] = useState({});
  const { id } = useParams();

  const fetchCVData = async (id) => {
    const data = await apis.cv.getCVData(id);
    if (data.success) {
      setCVData(data.cvData);
      setCVData((cvData) => {
        return cvData;
      });
    }
  };

  useEffect(() => {
    fetchCVData(id);
  }, [id]);
  return cvData;
}
