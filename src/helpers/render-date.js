const renderDate = (date) => {
  return Number(date.slice(5, 7)) + '/' + Number(date.slice(8, 10));
};

export { renderDate };
