import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchAllClasses() {
  const [classes, setClasses] = useState([]);
  const fetchClasses = async () => {
    const data = await apis.classes.getAllClasses();
    if (data.success) {
      setClasses(data.classes);
      setClasses((classes) => {
        return classes;
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);
  return classes;
}
