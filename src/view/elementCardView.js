import View from './View.js';
import numberToWords from 'number-to-words';

class ElementCardView extends View {
  _parentEl = document.getElementById('element-card');
  _resultList = document.querySelector('.result-list');

  addHandlerResultList(handler) {
    this._resultList.addEventListener('click', e => {
      const btn = e.target.closest('.result-item');
      if (!btn) return;

      const { atomicNumber } = btn.dataset;

      handler(+atomicNumber);
    });
  }

  _markup() {
    const data = this._data;
    this._parentEl.classList.add('is-open');

    return /*html*/ `
        <div class="card-topline">
          <span class="card-type">
            <i></i> ${data.classification}
          </span>
          <button
            class="bookmark-button card-bookmark"
            type="button"
            aria-label="Bookmark ${data.name}"
            aria-pressed="false"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.7L6 21V4.75Z" />
            </svg>
          </button>
        </div>
        <div class="element-card-identity">
          <div class="card-number">${data.atomicNumber}</div>
          <div>
            <h2 id="card-element-name">${data.name}</h2>
            <p>${data.name} · Group ${data.group} · Period ${data.period}</p>
          </div>
          <div class="card-symbol">${data.symbol}</div>
        </div>
         ${this._generateMarkupAtomIllustration()}
        <div class="card-quick-facts">
          <div>
            <span>Mass number</span>
            <strong>${data.massNumber.toFixed(0)} u</strong>
          </div>
          <div>
            <span>Valency</span>
            <strong>${data.valency}</strong>
          </div>
          <div>
            <span>Classification</span>
            <strong>${data.classification}</strong>
          </div>
          <div>
            <span>Electron config.</span>
            <strong>${this._generateMarkupElectroConfigSuperScript()}</strong>
          </div>
        </div>
        <section class="card-isotopes">
          <div class="card-section-title">
            <h3>Isotopes</h3>

          </div>
          <div class="isotope-pills">
          ${this._generateIsotopesMarkup()}
          </div>
        </section>
        <div class="card-fun-fact">
          <span class="fun-fact-icon" aria-hidden="true">
            ✦
          </span>
          <div class="fun-fact-copy">
            <span class="fun-fact-label">FUN FACT</span>
            <p>
              <strong>${data.funFact}</strong>
            </p>
          </div>
        </div>
        <button
          class="more-button"
          type="button"
          aria-controls="element-overview"
        >
          More about ${data.name} <span aria-hidden="true">↗</span>
        </button>
      `;
  }

  //Helpers
  _generateIsotopesMarkup() {
    return this._data.isotopes
      .map(
        iso => `<span>
              <sup>${iso.massNumber}</sup>${this._data.symbol} <b>${iso.abundance ?? 'Not Sure!'}</b>
            </span>`,
      )
      .join('');
  }
  _generateMarkupElectroConfigSuperScript() {
    return Array.from(
      this._data.rawElectroConfig.matchAll(/(\d+[spdf])(\d+)/g),
      ([, orbital, count]) => `${orbital}<sup>${count}</sup>`,
    )
      .join(' ');
  }
  _generateMarkupAtomIllustration() {
    const configuration = this._data.organizeElectroConfig;
    const shellCount = configuration.size;
    let shellDiv = '';

    // Each entry represents one principal electron shell.
    configuration.forEach((value, key) => {
      const shellSize =
        shellCount <= 1 ? 51 : 51 + ((key - 1) * 49) / (shellCount - 1);

      shellDiv += `<div class="orbit orbit-${numberToWords.toWords(key)}" style="--shell-size: ${shellSize}px">
      ${this._generateMarkupElectronList(value)}</div>`;
    });

    return `<div
          class="atom-illustration"
          aria-label="Bohr model showing ${this._data.atomicNumber} protons and ${this._data.atomicNumber} electrons"
        >${shellDiv}<div class="nucleus">
            <b>${this._data.atomicNumber}p⁺</b>
            <small>${(this._data.massNumber - this._data.atomicNumber).toFixed(0)}n⁰</small>
          </div></div>`;
  }

  //Helper for Helper
  _generateMarkupElectronList(subshells) {
    const electronCount = subshells.reduce((total, subshell) => {
      const [[, count]] = Object.entries(subshell);
      return total + Number(count);
    }, 0);

    return Array.from({ length: electronCount }, (_, index) => {
      const angle = (360 * index) / electronCount;
      return `<i class="electron" style="--electron-angle: ${angle}deg"></i>`;
    }).join('');
  }
}

export default new ElementCardView();
