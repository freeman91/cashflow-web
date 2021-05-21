import { dateStringShort, monthToString } from '../date-helper';

describe('date-helpers', () => {
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
});
