export function getUnpairedPairs(pairs) {
  return pairs?.filter((item) => !item.volunteer);
}
