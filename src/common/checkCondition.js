export function checkOverTimeToRegister(date, overDay) {
  if (date) {
    var currentdate = new Date();
    var differenceInTime = date.getTime() - currentdate.getTime();
    var differenceInDate = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDate < overDay) return true;
    else return false;
  }
}

export function checkUserCanUnRegisterAction(userId, personInChargeId, date) {
  if(checkOverTimeToRegister(date)) return false;
  else {
    if(personInChargeId && personInChargeId === userId) return false;
    else return true;
  }
}
