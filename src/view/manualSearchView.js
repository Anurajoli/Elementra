import View from './View.js';

class ManualSearchView extends View {
  _parentEl = document.querySelector('.result-list');
  _inputEl = document.getElementById('element-search');
  _searchForm = document.querySelector('.search-form');
  _searchModeEl = document.querySelector('.search-mode-picker');

  constructor() {
    super();
  }

  addHandlerSearchForm(handler) {
    this._searchForm.addEventListener('submit', e => {
      e.preventDefault();
      handler(this._refineQuery);
    });
  }

  addHandlerSearchRealTime(handler) {
    this._inputEl.addEventListener(
      'input',
      handler.bind(null, this._refineQuery()),
    );
  }

  addHandlerSearchMode(handler) {
    this._searchModeEl.addEventListener('click', e => {
      const option = e.target.closest('.search-mode-option');
      if (!option) return;

      const mode = option.firstElementChild.value;
     
      this._updateInputField(mode)
      handler(mode);
    });
  }

  _markup() {
    return this._data.map((el, i) => this._generateMarkup(el, i)).join('');
  }

  //Helpers
  _updateInputField(mode){
    console.log(mode)
   if(mode === 'atomic-number'){
    this._inputEl.type = 'number'
    this._inputEl.min = '1'
    this._inputEl.max = '118'
   }

   if(mode === 'symbol'){
     this._inputEl.type = 'text';
     this._inputEl.maxLength = '2';
     this._inputEl.pattern = '[A-Za-z]{2}';
   }

   if(mode === 'name'){
    this._inputEl.type = 'text'
    this._inputEl.pattern = '[A-Za-z]';
   }

  }

  _refineQuery() {
    let query = this._inputEl.value.trim();
    query = query.slice(0, 1).toUpperCase() + query.slice(1).toLowerCase();

    return query;
  }

  _generateMarkup(el, i) {
    console.log(el, i);
    return ` <article class="result-item is-active"
                data-atomic-number="${el.atomicNumber}"
                tabindex="${i}">
                <div class="element-thumb"
                  aria-hidden="true"><span>${el.symbol}</span></div><div
                  class="result-copy"><strong>${el.name}</strong><span>${el.symbol} ·
                    ${el.atomicNumber}</span></div><button class="bookmark-button" type="button"
                  aria-label="Bookmark" aria-pressed="false"><svg
                    viewBox="0 0 24 24" aria-hidden="true"><path
                      d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.7L6 21V4.75Z" /></svg></button>
              </article>`;
  }
}

export default new ManualSearchView();
