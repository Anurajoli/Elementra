import elements from './elementData.js';
import { MAX_ELEMENTS, MIN_ELEMENTS } from './configuration.js';

export const hasSpecialCharacter = function (str) {
  return /[^a-zA-Z0-9\s]/.test(str);
};

export const atomicNumberFind = function (str) {
  return elements.findIndex(el => el.symbol === str || el.name === str);
};

export const checkAtomicNumber = async function (atomicNumber) {
  if (atomicNumber > MAX_ELEMENTS)
    throw new Error('Maximum atomic number is 118.');
  if (atomicNumber < MIN_ELEMENTS)
    throw new Error('Minimum atomic number is 1.');
};
