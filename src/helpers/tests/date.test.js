import {
  dateToString,
  dateStringShort,
  dateToMonthString,
  dateToMonthRange,
  monthToString,
  monthToWeeks,
  weekToMonthString,
  weekToMonthNumber,
} from '../date-helper';

describe('date-helpers', () => {
  describe('dateToString', () => {
    it('returns a valid date string given a date with format MM-DD-YYYY 1', (done) => {
      expect(dateToString(new Date('10-01-2020'))).toBe('2020-10-01');
      done();
    });

    it('returns a valid date string given a date with format MM-DD-YYYY 2', (done) => {
      expect(dateToString(new Date('01-01-2021'))).toBe('2021-01-01');
      done();
    });
  });

  describe('dateStringShort', () => {
    it('returns short formatted date 1', (done) => {
      expect(dateStringShort('2020-10-01')).toBe('10/1');
      done();
    });

    it('returns short formatted date 2', (done) => {
      expect(dateStringShort('2021-01-12')).toBe('1/12');
      done();
    });
  });

  describe('dateToMonthString', () => {
    it('returns correct month name 1', (done) => {
      expect(dateToMonthString('2020-10-01')).toBe('October 1');
      done();
    });

    it('returns correct month name 2', (done) => {
      expect(dateToMonthString('2020-04-20')).toBe('April 20');
      done();
    });
  });

  describe('dateToMonthRange', () => {
    it('returns correct month range 1', (done) => {
      expect(dateToMonthRange(new Date('10-01-2020'))).toStrictEqual({
        startDate: '2020-09-28',
        endDate: '2020-10-25',
      });
      done();
    });

    it('returns correct month range 2', (done) => {
      expect(dateToMonthRange(new Date('04-20-2020'))).toStrictEqual({
        startDate: '2020-03-30',
        endDate: '2020-04-26',
      });
      done();
    });
  });

  describe('monthToString', () => {
    it('returns correct month name 1', (done) => {
      expect(monthToString(10)).toBe('October');
      done();
    });

    it('returns correct month name 2', (done) => {
      expect(monthToString(4)).toBe('April');
      done();
    });
  });

  describe('monthToWeeks', () => {
    it('returns correct array of weeks 1', (done) => {
      expect(monthToWeeks(4)).toStrictEqual([14, 15, 16, 17]);
      done();
    });

    it('returns correct array of weeks 2', (done) => {
      expect(monthToWeeks(10)).toStrictEqual([40, 41, 42, 43]);
      done();
    });
  });

  describe('weekToMonthString', () => {
    it('returns correct month name 1', (done) => {
      expect(weekToMonthString(40)).toBe('October');
      done();
    });

    it('returns correct month name 1', (done) => {
      expect(weekToMonthString(16)).toBe('April');
      done();
    });
  });

  describe('weekToMonthNumber', () => {
    it('returns the correct month number 1', (done) => {
      expect(weekToMonthNumber(40)).toBe(10);
      done();
    });

    it('returns the correct month number 2', (done) => {
      expect(weekToMonthNumber(16)).toBe(4);
      done();
    });
  });

  describe('Date.getWeek', () => {
    it('returns the correct week number 1', (done) => {
      expect(new Date('10-01-2020').getWeek()).toBe(40);
      done();
    });

    it('returns the correct week number 2', (done) => {
      expect(new Date('04-20-2020').getWeek()).toBe(17);
      done();
    });
  });
});
