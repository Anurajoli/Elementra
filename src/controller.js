window.myLove = 'Alisha Baby 💝';

import * as model from './model.js';

import manualSearchView from './view/manualSearchView.js';
/////////////////////////////////////////////////////
//

//////////////////// helpers
function managaeSpecificError(msg) {
  if (msg === 'Ignore!') return true;
  if (msg === 'Clear!') {
    manualSearchView.clear();
    return true;
  }
}
//////////////////////////

//Handle Search during typing
async function handleManualSearch(query) {
  try {
    //handle unexpected number from text
    if (typeof query === 'number') handleSearchModeChange('atomic-number');

    //Change the state
    model.state.searchMode === 'atomic-number'
      ? await model.modifyAtNoState(query)
      : await model.modifyMatchingElementsState(query);

    //Finding Element
    manualSearchView.render(model.getSearchElementsData());
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
  manualSearchView.addHandlerSearchMode(handleSearchModeChange);
  manualSearchView.addHandlerManualSearch(handleManualSearch);
}
init();
