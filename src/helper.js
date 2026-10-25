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

export const getMatchingEl = async function(str, searchMode) {
  const matchingEl = elements.filter(el => el[searchMode].startsWith(str))

  if(!matchingEl.length) throw new Error('Element not found.')
  return matchingEl
}

export const checkAtomicNumber = async function (atomicNumber) {
  if (atomicNumber > MAX_ELEMENTS)
    throw new Error('Maximum atomic number is 118.', {
      cause: { cause: 'Out of Range' },
    });
  if (atomicNumber < MIN_ELEMENTS)
    throw new Error('Minimum atomic number is 1.', {
      cause: { cause: 'Out of Range' },
    });
};
