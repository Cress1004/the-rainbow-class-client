export function getUnpairedPairs(pairs) {
  return pairs?.filter((item) => !item.volunteer);
}

export function checkCurrentVolunteerWithCurrentPair(volunteerOfPairId, currentVolunteerId) {
  if (volunteerOfPairId === currentVolunteerId) return true;
  else return false;
}
