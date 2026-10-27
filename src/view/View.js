class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._markup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  clear() {
    this._clear();
  }
  _clear() {
    this._parentEl.replaceChildren();
  }
  renderSpinner() {
    const markup = `<div class="spinner-container">
                      <div class="spinner">
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                        <div class="blade"></div>
                      </div>
                    </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(
    title = 'Failed to load',
    msg = 'Please check your connection and try again.',
  ) {
    const markup = `<div class="error-card">
                         <div class="error-icon">⚠️</div>
                         <div class="error-content">
                         <div class="error-title">${title}</div>
                         <div class="error-desc">${msg}</div>
                         </div>
                        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default View;
