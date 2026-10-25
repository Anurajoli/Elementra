const myLove = 'Alisha Baby 💝';

import * as model from './model.js';

import elements from './elementData.js';
import {
  hasSpecialCharacter,
  getMatchingEl,
  checkAtomicNumber,
} from './helper.js';

import manualSearchView from './view/manualSearchView.js';

/////////////////////////////////////////////////////
//

////////////////////helpers
async function modifyAtNoState(query) {
  try {
    if (query === model.state.atomicNumber) throw new Error('Ignore!');
    //Clears when input field is empty / 0
    if (!query) throw new Error('Clear!');

    await checkAtomicNumber(query);
    model.state.atomicNumber = query;
  } catch (err) {
    //manupulate state when atomic no. is out of range
    if (err.cause?.cause === 'Out of Range') model.state.atomicNumber = 0;
    throw err;
  }
}

async function modifyMatchingElementsState(query) {
  try {
    if (model.state[`${model.state.searchMode}`] === query)
      throw new Error('Ignore!');

    await hasSpecialCharacter(query);
    const matchingElements = await getMatchingEl(query, model.state.searchMode);

    model.state.matchingElements = matchingElements;
  } catch (err) {
    throw err;
  }
}

function updateStateProperties() {
  const element = elements[model.state.atomicNumber - 1];

  model.state.symbol = element.symbol;
  model.state.name = element.name;
}

function managaeSpecificError(msg) {
  if (msg === 'Ignore!') return true;
  if (msg === 'Clear!') {
    manualSearchView.clear();
    return true;
  }
}
//////////////////////////

//Handle form submit of Search
async function handleManualSearchForm(query) {
  try {
    model.state.searchMode === 'atomic-number'
      ? await modifyAtNoState(query)
      : await modifyMatchingElementsState(query);

    updateStateProperties();

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    if (managaeSpecificError(err.message)) return;

    console.error(err);
    manualSearchView.renderError('Invalid input', err.message);
  }
}

//Handle Search during typing
async function handleManualSearchRealTime(query) {
  try {
    model.state.searchMode === 'atomic-number'
      ? await modifyAtNoState(query)
      : await modifyMatchingElementsState(query);

    updateStateProperties();

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    if (managaeSpecificError(err.message)) return;

    console.error(err);
    manualSearchView.renderError('Invalid input', err.message);
  }
}

//Change the searchmode from the Dom
function handleSearchModeChange(mode) {
  model.state.searchMode = mode;
}

//initialization when Page Loads
function init() {
  manualSearchView.addHandlerSearchForm(handleManualSearchForm);
  manualSearchView.addHandlerSearchMode(handleSearchModeChange);
  manualSearchView.addHandlerSearchRealTime(handleManualSearchRealTime);
}
init();
