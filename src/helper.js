import elements from './elementData.js';
import { MAX_ELEMENTS, MIN_ELEMENTS } from './configuration.js';
import toSuperScript from './superScriptUnicode.js';

export const hasSpecialCharacter = async function (str) {
  if (/[^a-zA-Z0-9\s]/.test(str))
    throw new Error('Elements do not contain special characters.');
};

export const getMatchingEl = async function (str, searchMode) {
  if (str === '') throw new Error('Clear!');
  const matchingEl = elements.filter(el => el[searchMode].startsWith(str));

  if (!matchingEl.length) throw new Error('Element not found.');
  return matchingEl;
};

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

export const organizeIsotopesObj = function (isotopes) {
  return isotopes.map(iso => {
    const abundance = iso.abundance
      ? getScientificNotation(iso.abundance)
      : 'Not Sure!';
    return {
      abundance,
      massNumber: iso.mass_number,
    };
  });
};

export const organizeElectroConfig = function (arrangement) {
  const configuration = new Map();

  const subshells = arrangement.matchAll(/(\d+)([spdf])(\d+)/g);
  for (const [, principal, subShellName, electronCount] of subshells) {
    const shell = Number(principal);
    if (!configuration.has(shell)) configuration.set(shell, []);

    configuration.get(shell).push({ [subShellName]: electronCount });
  }

  return configuration;
};

export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    if(!response.ok) throw new Error(`HTTP ERROR: ${response.status}.`)

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

//HElpers
function getScientificNotation(num) {
  let exponent = 0;

  while (num < 1) {
    num *= 10;
    exponent--;
  }

  exponent = exponent
    .toString()
    .split('')
    .map(digit => toSuperScript[digit])
    .join('');

  return `${num.toFixed(2)}\u271610${exponent}`;
}
