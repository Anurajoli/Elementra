import elements from './elementData.js';
import {
  checkAtomicNumber,
  hasSpecialCharacter,
  getMatchingEl,
  organizeIsotopesObj,
  organizeElectroConfig,
} from './helper.js';
import { API_ELEMENT_CARD } from './configuration.js';

//State
export const state = {
  atomicNumber: 0, //Atomic Number
  matchingElements: [],

  elementCard: {
    atomicNumber: 0,
    data: {},
  },

  searchMode: 'atomic-number', //Search Mode (symbol, name, atomic number)
};

//////////////////////////////////////`////////State modifying functions.
export const modifyMatchingElementsState = async function (query) {
  try {
    if (state[`${state.searchMode}`] === query) throw new Error('Ignore!');

    await hasSpecialCharacter(query);
    const matchingElements = await getMatchingEl(query, state.searchMode);

    state.matchingElements = matchingElements;
  } catch (err) {
    throw err;
  }
};
export const modifyAtNoState = async function (query) {
  try {
    if (query === state.atomicNumber) throw new Error('Ignore!');
    //Clears when input field is empty / 0
    if (!query) throw new Error('Clear!');

    await checkAtomicNumber(query);
    state.atomicNumber = query;
  } catch (err) {
    //manupulate state when atomic no. is out of range
    if (err.cause?.cause === 'Out of Range') state.atomicNumber = 0;
    throw err;
  }
};
/////////////////////////////////////////////

export const getSearchElementsData = function () {
  if (state.searchMode === 'atomic-number') {
    return [elements[state.atomicNumber - 1]];
  }

  return state.matchingElements;
};

export const getElementsDataForCard = async function (atomicNumber) {
  try {
    const res = await fetch(`${API_ELEMENT_CARD}/${atomicNumber}/`);
    const data = await res.json();

    state.elementCard.atomicNumber = atomicNumber;
    state.elementCard.data = {
      atomicNumber,
      name: data.name,
      group: data.group_number,
      period: data.period,
      symbol: data.symbol,
      classification: data.category,
      massNumber: data.atomic_mass,
      valency: data.oxidation_states,
      funFact: data.fun_fact,
      rawElectoConfg: data.electron_configuration,
      isotopes: organizeIsotopesObj(data.isotopes),
      organizeElectoConfig: organizeElectroConfig(ata.electron_configuration),
    };
  } catch (err) {
    throw err;
  }
};
