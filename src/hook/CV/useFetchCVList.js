/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import apis from "../../apis";
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
      classId: item.class._id,
      createdAt: item.created_at
    }));
  };

  const fetchAllCV = async () => {
    const data = await apis.cv.getAllCV();
    if (data.success) {
      setCVList(transformCVData(data.cvList));
      setCVList((cvList) => {
        return cvList;
      });
    }
  };

  useEffect(() => {
    fetchAllCV();
  }, []);

  return cvList;
}
