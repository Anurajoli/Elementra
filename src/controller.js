import * as model from './model.js';

import {
  hasSpecialCharacter,
  atomicNumberFind,
  checkAtomicNumber,
} from './helper.js';

import manualSearchView from './view/manualSearchView.js';

/////////////////////////////////////////////////////

async function handleManualSearchForm(query) {
  try {
    //Input Checking
    if (query === model.state.atomicNumber) return;

    if (hasSpecialCharacter(query))
      throw new Error('Elements do not contain special characters.');

    if (!Number.isNaN(+query)) {
      await checkAtomicNumber(query);
      model.state.atomicNumber = query;
    } else {
      const atomicNo = atomicNumberFind(query);
      if (atomicNo === -1) throw new Error('Element not found.');

      model.state.atomicNumber = atomicNo + 1;
    }

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    console.error(err);
    manualSearchView.renderError('Invalid input', err.message);
  }
}

async function handleManualSearchRealTime(query) {
  try {
    //Input Checking
    if (query === model.state.atomicNumber) return;

    if (hasSpecialCharacter(query))
      throw new Error('Elements do not contain special characters.');

    if (!Number.isNaN(+query)) {
      await checkAtomicNumber(query);
      model.state.atomicNumber = query;
    } else {
      const atomicNo = atomicNumberFind(query);
      if (atomicNo === -1) throw new Error('Element not found.');

      model.state.atomicNumber = atomicNo + 1;
    }

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    console.error(err);
    manualSearchView.renderError('Invalid input', err.message);
  }
}

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
