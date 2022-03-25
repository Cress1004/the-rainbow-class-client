import Axios from "axios";

export function fetchCVData (cvId) {
    Axios.post(`/api/cv/${cvId}`, {cvId: cvId}).then((response) => {
        const res = response.data;
        if (res.success) {
          return res.cvData;
        }
      });
}