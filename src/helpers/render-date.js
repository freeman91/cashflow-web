import { month, getMonthNumber } from './month-names';
import './Date';
import { getWeeks } from './date-helper';
import formatDateObject from './format-date-object';

const renderDate = (date) => {
  return Number(date.slice(5, 7)) + '/' + Number(date.slice(8, 10));
};

const renderDateMonthName = (date) => {
  return month[Number(date.slice(5, 7)) - 1] + ' ' + Number(date.slice(8, 10));
};

const getMonthRange = (date) => {
  const monthNumber = getMonthNumber(date.getWeek()) - 1;
  var startDate = new Date(date.getFullYear(), monthNumber, 1);
  var endDate = new Date(date.getFullYear(), monthNumber + 1, 0);
  const weeks = getWeeks(monthNumber + 1);

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
    startDate: formatDateObject(startDate),
    endDate: formatDateObject(endDate),
  };
};

export { renderDate, renderDateMonthName, getMonthRange };
