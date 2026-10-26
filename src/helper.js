import elements from './elementData.js';
import { MAX_ELEMENTS, MIN_ELEMENTS } from './configuration.js';

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
    return { abundance: iso.abundance, massNumber: iso.mass_number };
  });
};

export const organizeElectroConfig = function (arrangement) {
  const configuration = new Map()

  arrangement.split(' ').forEach(subShell => {
    const principal = +subShell.slice(0, 1);

    if (!configuration.has(principal)) configuration.set(principal, []);
    let temp;
    const subShellName = subShell.slice(1, 2);
    const getElectronNo = () => subShell.slice(2, 3);

    //Preparing object to push
    if (subShellName === 's') temp = { s: getElectronNo() };
    if (subShellName === 'p') temp = { p: getElectronNo() };
    if (subShellName === 'd') temp = { d: getElectronNo() };
    if (subShellName === 'f') temp = { f: getElectronNo() };

    configuration.get(principal).push(temp);
  });

  return configuration;
};
