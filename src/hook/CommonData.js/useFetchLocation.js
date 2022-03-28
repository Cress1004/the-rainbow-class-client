import { useEffect, useState } from "react";
import apis from "../../apis";

export default function useFetchLocation() {
  const [location, setLocation] = useState([]);
  const fetchLocation = async () => {
    const data = await apis.commonData.getLocation();
    if (data.success) {
      setLocation(data.location);
      setLocation((location) => {
        return location;
      });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);
  return location;
}
