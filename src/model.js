import elements from "./elementData.js"
import { checkAtomicNumber, hasSpecialCharacter, getMatchingEl } from "./helper.js";

//State
export const state = {
    atomicNumber: 0, //Atomic Number
    matchingElements: [],

    searchMode: 'atomic-number', //Search Mode (symbol, name, atomic number)
}

//////////////////////////////////////////////State modifying functions.
 export const modifyMatchingElementsState = async function (query) {
  try {
    if (state[`${state.searchMode}`] === query)
      throw new Error('Ignore!');

    await hasSpecialCharacter(query);
    const matchingElements = await getMatchingEl(query, state.searchMode);

    state.matchingElements = matchingElements;
  } catch (err) {
    throw err;
  }
}
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
}
/////////////////////////////////////////////

export const getSearchElementsData = function() {
    if(state.searchMode === 'atomic-number'){
        return [elements[state.atomicNumber - 1]]
    }

    return state.matchingElements
}