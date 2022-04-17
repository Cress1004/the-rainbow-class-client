import { useState, useEffect } from "react";
import apis from "../../apis";

export default function useFetchVolunteerData(volunteerId) {
  const [volunteerData, setVolunteerData] = useState({});

  const fetchVolunteerData = async () => {
    const data = await apis.volunteer.getVolunteerData(volunteerId);
    if (data.success) {
      const volunteer = data.volunteer;
      setVolunteerData({
        id: volunteer._id,
        name: volunteer.user.name,
        email: volunteer.user.email,
        gender: volunteer.user.gender,
        image: volunteer.user.image,
        address: volunteer.user.address,
        phoneNumber: volunteer.user.phoneNumber,
        volunteerRole: volunteer.role,
        className: volunteer.user.class?.name,
        isAdmin: volunteer.isAdmin,
        role: data.volunteerRole,
        linkFacebook: volunteer.user.linkFacebook
      });
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  return volunteerData;
}
