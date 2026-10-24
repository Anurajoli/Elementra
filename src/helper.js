import elements from './elementData.js';
import { MAX_ELEMENTS, MIN_ELEMENTS } from './configuration.js';

export const hasSpecialCharacter = async function (str) {
  if (/[^a-zA-Z0-9\s]/.test(str))
    throw new Error('Elements do not contain special characters.');
};

export const atomicNumberFind = async function (str) {
  const index = elements.findIndex(el => el.symbol === str || el.name === str);
  if (index === -1) throw new Error('Element not found.');

  return index;
};

export const checkAtomicNumber = async function (atomicNumber) {
  if (atomicNumber > MAX_ELEMENTS)
    throw new Error('Maximum atomic number is 118.');
  if (atomicNumber < MIN_ELEMENTS)
    throw new Error('Minimum atomic number is 1.');
};
