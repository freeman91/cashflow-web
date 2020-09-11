const month = [];
month[0] = 'January';
month[1] = 'February';
month[2] = 'March';
month[3] = 'April';
month[4] = 'May';
month[5] = 'June';
month[6] = 'July';
month[7] = 'August';
month[8] = 'September';
month[9] = 'October';
month[10] = 'November';
month[11] = 'December';

const getMonthName = (week) => {
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

const getMonthNumber = (week) => {
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

export { month, getMonthName, getMonthNumber };
