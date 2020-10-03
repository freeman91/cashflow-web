import './Date';

const dateToString = (date) => {
  if (typeof date === 'string') return date;

  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

const dateStringShort = (date) => {
  return Number(date.slice(5, 7)) + '/' + Number(date.slice(8, 10));
};

const dateToMonthString = (date) => {
  return (
    monthToString(Number(date.slice(5, 7))) + ' ' + Number(date.slice(8, 10))
  );
};

const dateToMonthRange = (date) => {
  const monthNumber = weekToMonthNumber(date.getWeek());
  var startDate = new Date(date.getFullYear(), monthNumber - 1, 1);
  var endDate = new Date(date.getFullYear(), monthNumber, 0);
  const weeks = monthToWeeks(monthNumber);

  while (weeks.includes(startDate.getWeek())) {
    startDate.setDate(startDate.getDate() - 1);
  }
  while (!weeks.includes(startDate.getWeek())) {
    startDate.setDate(startDate.getDate() + 1);
  }

  while (weeks.includes(endDate.getWeek())) {
    endDate.setDate(endDate.getDate() + 1);
  }
  while (!weeks.includes(endDate.getWeek())) {
    endDate.setDate(endDate.getDate() - 1);
  }
  return {
    startDate: dateToString(startDate),
    endDate: dateToString(endDate),
  };
};

const monthToString = (month) => {
  switch (month) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
    default:
      return 'January';
  }
};

const monthToWeeks = (month) => {
  switch (month) {
    case 1:
      return [1, 2, 3, 4];
    case 2:
      return [5, 6, 7, 8];
    case 3:
      return [9, 10, 11, 12, 13];
    case 4:
      return [14, 15, 16, 17];
    case 5:
      return [18, 19, 20, 21];
    case 6:
      return [22, 23, 24, 25, 26];
    case 7:
      return [27, 28, 29, 30];
    case 8:
      return [31, 32, 33, 34];
    case 9:
      return [35, 36, 37, 38, 39];
    case 10:
      return [40, 41, 42, 43];
    case 11:
      return [44, 45, 46, 47];
    case 12:
      return [48, 49, 50, 51, 52, 53];
    default:
      return 1;
  }
};

const weekToMonthString = (week) => {
  switch (week) {
    case 1:
    case 2:
    case 3:
    case 4:
      return 'January';
    case 5:
    case 6:
    case 7:
    case 8:
      return 'February';
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
      return 'March';
    case 14:
    case 15:
    case 16:
    case 17:
      return 'April';
    case 18:
    case 19:
    case 20:
    case 21:
      return 'May';
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
      return 'June';
    case 27:
    case 28:
    case 29:
    case 30:
      return 'July';
    case 31:
    case 32:
    case 33:
    case 34:
      return 'August';
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
      return 'September';
    case 40:
    case 41:
    case 42:
    case 43:
      return 'October';
    case 44:
    case 45:
    case 46:
    case 47:
      return 'November';
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
      return 'December';
    default:
      return 'January';
  }
};

const weekToMonthNumber = (week) => {
  switch (week) {
    case 1:
    case 2:
    case 3:
    case 4:
      return 1;
    case 5:
    case 6:
    case 7:
    case 8:
      return 2;
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
      return 3;
    case 14:
    case 15:
    case 16:
    case 17:
      return 4;
    case 18:
    case 19:
    case 20:
    case 21:
      return 5;
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
      return 6;
    case 27:
    case 28:
    case 29:
    case 30:
      return 7;
    case 31:
    case 32:
    case 33:
    case 34:
      return 8;
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
      return 9;
    case 40:
    case 41:
    case 42:
    case 43:
      return 10;
    case 44:
    case 45:
    case 46:
    case 47:
      return 11;
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
      return 12;
    default:
      return 1;
  }
};

export {
  dateToString,
  dateStringShort,
  dateToMonthString,
  dateToMonthRange,
  monthToString,
  monthToWeeks,
  weekToMonthString,
  weekToMonthNumber,
};
