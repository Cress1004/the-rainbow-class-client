import Axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useFetchClassData(classId) {
  const [classData, setClassData] = useState({});

  const { t } = useTranslation();
  useEffect(() => {
    Axios.post(`/api/classes/${classId}`, { classId: classId }).then(
      (response) => {
        const res = response.data;
        if (res.success) {
          setClassData(res.classData);
          setClassData((classData) => {
            return classData;
          });
        } else if (!res.success) {
          alert(res.message);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, classId]);
  return classData;
}
