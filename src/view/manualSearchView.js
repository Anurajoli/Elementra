import View from './View.js';

class ManualSearchView extends View {
  _parentEl = document.querySelector('.result-list');
  _inputEl = document.getElementById('element-search');
  _searchModeEl = document.querySelector('.search-mode-picker');
  _atomicNumberModeEl = document.querySelector(
    '.search-mode-option input[value="atomic-number"]',
  );

  _searchMode = 'atomic-number';

  addHandlerManualSearch(handler) {
    this._inputEl.addEventListener('input', () => {
      const query = this._refineQuery()

      //Check whether the input is number.
      if (query !== '' && !Number.isNaN(+query) ) {
        this._searchMode = 'atomic-number';
        this._atomicNumberModeEl.click();
        return handler(+query);
      }

      handler(query);
    });
  }

  addHandlerSearchMode(handler) {
    this._searchModeEl.addEventListener('click', e => {
      const option = e.target.closest('.search-mode-option');
      if (!option) return;

      const mode = option.firstElementChild.value;
      handler(mode);

      this._updateInputField(mode);
      this._clear()
      this._searchMode = mode;

      this._searchModeEl.removeAttribute('open');
    });
  }

  _markup() {
    return this._data.map((el, i) => this._generateMarkup(el, i)).join('');
  }

  //Helpers
  _updateInputField(mode) {
    switch (mode) {
      case 'atomic-number':
        this._inputEl.type = 'number';
        break;
      case 'symbol':
        this._inputEl.maxLength = '2';
        this._inputEl.type = 'text';
      case 'name':
        this._inputEl.type = 'text';
        this._inputEl.maxLength && this._inputEl.removeAttribute('maxLength');
    }
  }

  _refineQuery() {
    let query = this._inputEl.value;

    query =
      this._searchMode === 'atomic-number'
        ? +query
        : query.slice(0, 1).toUpperCase() + query.slice(1).toLowerCase();

    return query;
  }

  _generateMarkup(el, i) {
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
