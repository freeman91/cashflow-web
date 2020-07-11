const stringToDate = (dateString) => {
  return new Date(
    dateString.slice(0, 4),
    dateString.slice(5, 7) - 1,
    dateString.slice(8, 10)
  );
};

const dateToString = (date) => {
  var dateStr =
    padStr(date.getFullYear()) +
    '-' +
    padStr(1 + date.getMonth()) +
    '-' +
    padStr(date.getDate());
  return dateStr;
};

const padStr = (i) => {
  return i < 10 ? '0' + i : '' + i;
};

export default { dateToString, stringToDate };
