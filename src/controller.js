import * as model from './model.js';

import elements from './elementData.js';
import {
  hasSpecialCharacter,
  atomicNumberFind,
  checkAtomicNumber,
} from './helper.js';

import manualSearchView from './view/manualSearchView.js';

/////////////////////////////////////////////////////
//

////////////////////helpers
async function modifyAtNoFromAtNo(query) {
  try {
    console.log(query)
    if (query === model.state.atomicNumber || !query) throw new Error('Ignore!');
    await checkAtomicNumber(query);

    model.state.atomicNumber = query;
  } catch (err) {
    throw err;
  }
}

async function modifyAtNoFromElse(query) {
  try {
    if (model.state[`${model.state.searchMode}`] === query)
      throw new Error('Ignore!');

    await hasSpecialCharacter(query);
    const atomicNo = await atomicNumberFind(query);

    model.state.atomicNumber = atomicNo + 1;
  } catch (err) {
    throw err;
  }
}

function updateStateProperties() {
  const element = elements[model.state.atomicNumber - 1];

  model.state.symbol = element.symbol;
  model.state.name = element.name;
}
//////////////////////////

//Handle form submit of Search
async function handleManualSearchForm(query) {
  try {
    model.state.searchMode === 'atomic-number'
      ? await modifyAtNoFromAtNo(query)
      : await modifyAtNoFromElse(query);

    updateStateProperties();

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    if (err.message === 'Ignore!') return;

    console.error(err);
    manualSearchView.renderError('Invalid input', err.message);
  }
}

//Handle Search during typing
async function handleManualSearchRealTime(query) {
  try {
    console.log(query)
    model.state.searchMode === 'atomic-number'
      ? await modifyAtNoFromAtNo(query)
      : await modifyAtNoFromElse(query);

    updateStateProperties();

    //Finding Element
    manualSearchView.render(model.findELementByAtNo());
  } catch (err) {
    if (err.message === 'Ignore!') return;

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
