const getDate = (dateString) => {
  return new Date(
    dateString.slice(0, 4),
    dateString.slice(5, 7) - 1,
    dateString.slice(8, 10)
  );
};

export default getDate;
