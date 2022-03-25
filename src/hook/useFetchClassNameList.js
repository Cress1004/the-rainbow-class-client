import Axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useFetchClassData() {
  const [classes, setClasses] = useState({});

  const { t } = useTranslation();
  useEffect(() => {
    Axios.post(`/api/classes/get-list-class-with-name`, null).then(
      (response) => {
        const res = response.data;
        if (res.success) {
          setClasses(res.classes);
          setClasses((classes) => {
            return classes;
          });
        } else if (!res.success) {
          alert(res.message);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t]);
  return classes;
}
