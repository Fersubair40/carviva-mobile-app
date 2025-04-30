import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export const fCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value);

export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fShortenNumber(number: number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number: number) {
  return numeral(number).format('0.0 b');
}
