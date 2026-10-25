import elements from "./elementData.js"

export const state = {
    atomicNumber: 0, //Atomic Number
    matchingElements: [],

    searchMode: 'name', //Search Mode (symbol, name, atomic number)
}

export const findELementByAtNo = function() {
    const { atomicNumber } = state

    const elementData = elements[state.atomicNumber - 1]
    elementData.atomicNumber = atomicNumber

    return [elementData];
}