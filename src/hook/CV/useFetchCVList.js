import Axios from "axios";
import { useState, useEffect } from "react";
import { getCVStatus } from "../../components/common/function";

export default function useFetchCVList() {
  const [cvList, setCVList] = useState({});
  
  const transformCVData = (cvList) => {
    return cvList?.map((item, index) => ({
      key: index,
      id: item._id,
      userName: item.userName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      status: getCVStatus(item.status),
      className: item.class.name,
      classId: item.class._id
    }));
  };
  
  useEffect(() => {
    Axios.post(`/api/cv/get-all-cv`, null).then((response) => {
      const res = response.data;
      if (res.success) {
        setCVList(transformCVData(res.cvList));
        setCVList((cvList) => {
          return cvList;
        });
      }
    });
  }, []);
  return cvList;
}
