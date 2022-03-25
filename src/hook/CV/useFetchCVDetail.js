import Axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function useFetchCVData() {
  const [cvData, setCVData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    Axios.post(`/api/cv/${id}`, {cvId: id}).then((response) => {
      const res = response.data;
      if (res.success) {
        setCVData(res.cvData);
        setCVData((cvData) => {
          return cvData;
        });
      }
    });
  }, [id]);
  return cvData;
}
