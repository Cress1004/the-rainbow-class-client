import moment from "moment";
import { FORMAT_MONTH_STRING } from "../constant";

export function checkNowOverSemesterTime(start, end) {
  var startDate = new Date(start);
  var currentDate = new Date();
  var endDate = new Date(end);
  var differenceInStartTime = currentDate.getTime() - startDate.getTime();
  var differenceStartDate = differenceInStartTime / (1000 * 3600 * 24);
  var differenceInEndTime = endDate.getTime() - currentDate.getTime();
  var differenceEndDate = differenceInEndTime / (1000 * 3600 * 24);
  return differenceStartDate >= 0 && differenceEndDate >= 0;
}

export function getMonthRangeBetweenTwoDate(start, end) {
  var timeValues = [];
  var dateStart = moment(start);
  var dateEnd = moment(end);
  while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
    timeValues.push(dateStart.format("YYYY-MM"));
    dateStart.add(1, "month");
  }
  return timeValues
}
