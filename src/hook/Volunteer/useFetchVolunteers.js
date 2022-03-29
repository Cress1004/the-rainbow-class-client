import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchVolunteers() {
  const [volunteers, setVolunteers] = useState([]);

  const fetchVolunteers = async () => {
    const data = await apis.volunteer.getVolunteers();
    if (data.success) {
      setVolunteers(data.volunteers);
      setVolunteers((volunteers) => {
        return volunteers;
      });
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return volunteers;
}
