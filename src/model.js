import elements from "./elementData.js"

export const state = {
    atomicNumber: 1, //Atomic Number
    name: 'Hydrogen',
    symbol: 'H',

    searchMode: 'atomic-number', //Search Mode (symbol, name, atomic number)
}

export const findELementByAtNo = function() {
    const { atomicNumber } = state

    const elementData = elements[state.atomicNumber - 1]
    elementData.atomicNumber = atomicNumber

    return [elementData];
}