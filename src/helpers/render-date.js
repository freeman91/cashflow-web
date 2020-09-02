import { month } from './month-names';

const renderDate = (date) => {
  return Number(date.slice(5, 7)) + '/' + Number(date.slice(8, 10));
};

const renderDateMonthName = (date) => {
  return month[Number(date.slice(5, 7)) - 1] + ' ' + Number(date.slice(8, 10));
};

export { renderDate, renderDateMonthName };
