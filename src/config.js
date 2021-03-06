export const LOCAL_API_URL = process.env.REACT_APP_LOCAL_API_URL;
export const AZURE_API_URL = process.env.REACT_APP_AZURE_API_URL;

export const SERVER_API_URL = process.env.NODE_ENV === "production" ? AZURE_API_URL : LOCAL_API_URL

export const USER_API = "/api/users";
export const UPLOAD_API = "/api/upload";
export const COMMON_DATA_API = "/api/common-data";
export const CLASS_API = "/api/classes";
export const SCHEDULE_API = "/api/schedule";
export const CV_API = "/api/cv";
export const VOLUNTEER_API = "/api/volunteers";
export const STUDENT_API = "/api/students";
export const PAIR_API = "/api/pairs";
export const REPORT_API = "/api/reports";
export const QUESTION_API = "/api/questions";
export const ANSWER_API = "/api/answers";
export const NOTIFICATION_API = "/api/notification";
export const ADMIN_API = "/api/admin";
export const ACHIEVEMENT_API = "/api/achievement";