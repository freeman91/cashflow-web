const getWeeks = (month) => {
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

export { getWeeks };
