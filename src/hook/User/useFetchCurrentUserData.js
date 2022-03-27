import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchCurrentUserData() {
  const [userRole, setUserRole] = useState({});
  const [userClassId, setUserClassId] = useState({});

  const fetchCurrentUser = async () => {
    const data = await apis.users.getCurrentUser();
    if (data.success) {
      setUserRole(data.userRole);
      setUserRole((userRole) => {
        return userRole;
      });
      setUserClassId(data.classId);
      setUserClassId((classId) => {
        return classId;
      });
    }
  };

  useEffect(() => {
   fetchCurrentUser();
  }, []);
  return { userRole, userClassId };
}
