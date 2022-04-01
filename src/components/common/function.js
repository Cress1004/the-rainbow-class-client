import {
  CALENDAR_COLOR_EVENT,
  CLASS_MONITOR,
  CV_STATUS,
  STUDENT,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
  VOLUNTEER,
} from "./constant";

export function generateKey() {
  return new Date().getTime();
}

export function setColorForClass(classes) {
  if (!classes) return {};
  return classes.map((item, index) => ({
    classId: item._id,
    color:
      CALENDAR_COLOR_EVENT[
        index > CALENDAR_COLOR_EVENT.length
          ? index - CALENDAR_COLOR_EVENT.length
          : index
      ],
  }));
}

export function checkAdminAndMonitorRole(userRole) {
  return (
    userRole &&
    (userRole.isAdmin ||
      userRole.subRole === CLASS_MONITOR ||
      userRole.subRole === SUB_CLASS_MONITOR)
  );
}

export function checkStudentAndCurrentUserSameClass(student, currentUserData) {
  const userRole = currentUserData.userRole;
  if (userRole.subRole === SUPER_ADMIN) return false;
  else if (userRole.isAdmin) return true;
  else return student.classId === currentUserData.userClassId;
}

export function checkStringContentSubString(string1, string2) {
  return string1?.toLowerCase().includes(string2?.toLowerCase());
}

export function calcFileSize(size) {
  return size * 1024 * 1024;
}

export function getCVStatus(status) {
  return CV_STATUS.find((item) => item.key === status);
}

export function convertRole(userRole) {
  if (userRole.role === STUDENT) return { eng: "Student", vie: "Học sinh" };
  else if (userRole.role === VOLUNTEER) {
    if (userRole.isAdmin) return { eng: "Admin", vie: "Quản trị viên" };
    else {
      if (userRole.subRole === CLASS_MONITOR)
        return { eng: "Class Monitor", vie: "Lớp trưởng" };
      else if (userRole.subRole === SUB_CLASS_MONITOR)
        return { eng: "Sub Class Monitor", vie: "Lớp phó" };
      else if (userRole.subRole === VOLUNTEER)
        return { eng: "Volunteer", vie: "Tình nguyện viên" };
      else return null;
    }
  } else return null;
}
