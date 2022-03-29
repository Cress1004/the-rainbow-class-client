import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apis from "../../apis";

export default function useFetchClassNameList() {
  const [classes, setClasses] = useState({});
  const { t } = useTranslation();

  const fetchListClassName = async () => {
    const data = await apis.classes.getListClassWithName();
    if (data.success) {
      setClasses(data.classes);
      setClasses((classes) => {
        return classes;
      });
    } else if (!data.success) {
      alert(data.message);
    } else {
      alert(t("fail_to_get_api"));
    }
  };

  useEffect(() => {
    fetchListClassName();
  }, []);
  return classes;
}
