import { numberToCurrency, numberToCurrency_ } from '../currency';

describe('currency helpers', () => {
  describe('numberToCurrency', () => {
    it('returns properly formatted currency string 1', (done) => {
      expect(numberToCurrency.format(12.0746345)).toBe('$12.07');
      done();
    });

    it('returns properly formatted currency string 2', (done) => {
      expect(numberToCurrency.format(42)).toBe('$42.00');
      done();
    });

    it('returns properly formatted currency string 3', (done) => {
      expect(numberToCurrency.format(1.9999999999)).toBe('$2.00');
      done();
    });
  });

  describe('numberToCurrency_', () => {
    it('returns properly formatted currency string 1', (done) => {
      expect(numberToCurrency_.format(12.0746345)).toBe('12.07');
      done();
    });

    it('returns properly formatted currency string 2', (done) => {
      expect(numberToCurrency_.format(42)).toBe('42.00');
      done();
    });

    it('returns properly formatted currency string 3', (done) => {
      expect(numberToCurrency_.format(1.9999999999)).toBe('2.00');
      done();
    });
  });
});
