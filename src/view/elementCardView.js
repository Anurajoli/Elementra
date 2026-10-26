import View from './View.js';

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

    return /*html*/ `<aside
        class="element-card is-open"
        id="element-card"
        aria-labelledby="card-element-name"
        aria-hidden="false"
      >
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
        <div
          class="atom-illustration"
          aria-label="Bohr model showing eight protons and eight electrons"
        >
          <div class="orbit orbit-one">
            <i class="electron e1"></i>
            <i class="electron e2"></i>
          </div>
          <div class="orbit orbit-two">
            <i class="electron e3"></i>
            <i class="electron e4"></i>
            <i class="electron e5"></i>
            <i class="electron e6"></i>
            <i class="electron e7"></i>
            <i class="electron e8"></i>
          </div>
          <div class="nucleus">
            <b>${data.atomicNumber}p⁺</b>
            <small>${(data.massNumber - data.atomicNumber).toFixed(0)}n⁰</small>
          </div>
        </div>
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
            <strong>${data.electoConfig}</strong>
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
      </aside>`;
  }
  _generateIsotopesMarkup() {
    return `${this._data.isotopes
      .map(
        iso => `<span>
              <sup>${iso.massNumber}</sup>${this._data.symbol} <b>${iso.abundance}</b>
            </span>`,
      )
      .join('')}`;
  }
}

export default new ElementCardView();
