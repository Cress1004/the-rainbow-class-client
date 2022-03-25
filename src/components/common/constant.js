export const WEEKDAY = [
  { key: 0, value: "all", text: "all" },
  { key: 1, value: "Sun", text: "Chủ Nhật" },
  { key: 2, value: "Mon", text: "Thứ Hai" },
  { key: 3, value: "Tue", text: "Thứ Ba" },
  { key: 4, value: "Wed", text: "Thứ Tư" },
  { key: 5, value: "Thu", text: "Thứ Năm" },
  { key: 6, value: "Fri", text: "Thứ Sáu" },
  { key: 7, value: "Sat", text: "Thứ Bảy" },
];

export const NOON_TIME = [
  {
    key: 0,
    value: "morning",
    text: "Sáng",
    startTime: "8:00",
    endTime: "11:00",
  },
  {
    key: 1,
    value: "afternoon",
    text: "Chiều",
    startTime: "13:00",
    endTime: "16:00",
  },
  {
    key: 2,
    value: "evening",
    text: "Tối",
    startTime: "19:00",
    endTime: "22:00",
  },
];

export const FORMAT_TIME_SCHEDULE = "HH:mm";
export const FORMAT_DATE = "YYYY/MM/DD";

export const OFFLINE_OPTION = 1;
export const ONLINE_OPTION = 0;

export const CALENDAR_COLOR_EVENT = [
  "#F9A09B",
  "#F48BB1",
  "#CD8FD9",
  "#B39BDC",
  "#9EA7DA",
  "#8DCAF9",
  "#81D4FA",
  "#81DDEA",
  "#81CBC4",
  "#A5D7A8",
  "#C4E1A7",
  "#E6EDA1",
  "#FFF5A3",
  "#FFE092",
  "#FECB8C",
  "#FEAA92",
  "#BCAAA4",
  "#AFBEC4",
  "#145114",
  "#67dfc4",
  "#a1c3c3",
  "#a1b2c3",
  "#33ff66",
  "#66ffff",
  "#47b264",
  "#f49d80",
  "#ff8da1",
  "#00ebc7",
  "#ff3333",
  "#eafdff",
  "#43249f",
  "#277b4a",
  "#4ffff2",
  "#b6134a",
  "#b6134a",
  "#ffc600",
  "#00ab4c",
  "#2acaea",
  "#c0ffee",
  "#6666aa",
  "#4666d0",
  "#c5d2d3",
  "#9fb5b7",
];

export const STATUS = {
  success: "success",
  warning: "warning",
  error: "error",
};

export const STUDENT = 0;
export const VOLUNTEER = 1;
export const SUB_CLASS_MONITOR = 2;
export const CLASS_MONITOR = 3;
export const SUPER_ADMIN = 4;

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const urlRegExp =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const LIMIT_PDF_FILE_SIZE = 1; //MB

export const CV_STATUS = [
  { key: 0, value: "pending", text: "Chưa được duyệt", color: "#e2a534" },
  { key: 1, value: "waiting", text: "Chờ phỏng vấn", color: "#4f9fd4" },
  { key: 2, value: "pass", text: "Đỗ phỏng vấn", color: "#219e6e" },
  { key: 3, value: "fail", text: "Trượt", color: "#858383" },
];

export const CV_STATUS_NAME = {
  PENDING: 0,
  WAITING: 1,
  PASS: 2,
  FAIL: 3,
};

export const LESSON_SCHEDULE = 0;
export const INTERVIEW_SCHEDULE = 2;

export const CONNECTION_PORT = "http://localhost:5000";

export const NOTI_TYPE = [{ key: 0, value: "newCV", text: "newCV" }];
