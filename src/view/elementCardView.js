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

  addHandlerDrag() {
    let dragState;
    const searchSection = document.querySelector('.search-sidebar');

    const getPositionLimits = rect => {
      const sidebar = searchSection.getBoundingClientRect();
      const gap = 12;
      const limits = {
        minX: 8,
        maxX: Math.max(8, window.innerWidth - rect.width - 8),
        minY: 8,
        maxY: Math.max(8, window.innerHeight - rect.height - 8),
      };

      if (sidebar.height > window.innerHeight * 0.6) {
        limits.minX = Math.min(limits.maxX, sidebar.right + gap);
      } else {
        limits.minY = Math.min(limits.maxY, sidebar.bottom + gap);
      }
      return limits;
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    this._parentEl.addEventListener('pointerdown', event => {
      if (
        !event.target.closest('.card-topline') ||
        event.target.closest('button')
      )
        return;
      if (event.button !== 0) return;

      const rect = this._parentEl.getBoundingClientRect();
      const limits = getPositionLimits(rect);
      const left = clamp(rect.left, limits.minX, limits.maxX);
      const top = clamp(rect.top, limits.minY, limits.maxY);

      this._parentEl.classList.add('is-dragged', 'is-dragging');
      this._parentEl.style.left = `${left}px`;
      this._parentEl.style.top = `${top}px`;
      this._parentEl.style.right = 'auto';
      this._parentEl.style.bottom = 'auto';
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left,
        top,
      };
      this._parentEl.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    this._parentEl.addEventListener('pointermove', event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      const rect = this._parentEl.getBoundingClientRect();
      const limits = getPositionLimits(rect);
      this._parentEl.style.left = `${clamp(dragState.left + event.clientX - dragState.startX, limits.minX, limits.maxX)}px`;
      this._parentEl.style.top = `${clamp(dragState.top + event.clientY - dragState.startY, limits.minY, limits.maxY)}px`;
    });

    const endDrag = event => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      dragState = undefined;
      this._parentEl.classList.remove('is-dragging');
    };
    this._parentEl.addEventListener('pointerup', endDrag);
    this._parentEl.addEventListener('pointercancel', endDrag);
  }

  _markup() {
    const data = this._data;
    this._parentEl.style.setProperty(
      '--element-color',
      data.cpkHexColor || '#7e9c77',
    );
    this._parentEl.style.setProperty(
      '--category-color',
      data.categoryColor || '#9cbd9b',
    );
    this._parentEl.classList.add('is-open');

    return `
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
            <span>Oxidation states</span>
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

        ${this._generateFunFactMarkup()}

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

  addHandlerFunFact() {
    this._parentEl.addEventListener('click', e => {
      const factToggle = e.target.closest('.fun-fact-text');
      if (!factToggle) return;

      const toggleBtn = factToggle.nextElementSibling;
      const textEl = factToggle.querySelector('strong');

      const condition = textEl.textContent.length < 80;

      textEl.textContent = condition
        ? this._data.funFact
        : this._data.funFact.slice(0, 75) + '...';
      toggleBtn.textContent = condition ? '^' : '⌄';

      toggleBtn.classList.toggle('is-expanded')
    });
  }

  //Helpers
  _generateFunFactMarkup() {
    //TODO
    return this._data.funFact.length > 75
      ? `<p class="fun-fact-text">
                    <strong>${this._data.funFact.slice(0, 75) + '...'}</strong>
                  </p><button class="fun-fact-toggle" type="button" aria-expanded="false" aria-label="Show full fun fact">
             <span aria-hidden="true">⌄</span>
                </button>`
      : `<p class="fun-fact-text"><strong>${this._data.funFact}</strong></p>`;
  }
  _generateIsotopesMarkup() {
    return this._data.isotopes
      .map(
        iso => `<span>
              <sup>${iso.massNumber}</sup>${this._data.symbol} <b>${iso.abundance}</b>
            </span>`,
      )
      .join('');
  }
  _generateMarkupElectroConfigSuperScript() {
    return Array.from(
      this._data.rawElectroConfig.matchAll(/(\d+[spdf])(\d+)/g),
      ([, orbital, count]) => `${orbital}<sup>${count}</sup>`,
    ).join(' ');
  }
  _generateMarkupAtomIllustration() {
    const electronsPerShell = this._data.electronsPerShell;
    const shellCount = electronsPerShell.length;
    let shellDiv = '';

    // Each entry represents one principal electron shell.
    electronsPerShell.forEach((electronCount, index) => {
      const shell = index + 1;
      const shellSize =
        shellCount <= 1 ? 51 : 51 + (index * 49) / (shellCount - 1);

      shellDiv += `<div class="orbit orbit-${numberToWords.toWords(shell)}" style="--shell-size: ${shellSize}px">
      ${this._generateMarkupElectronList(electronCount)}</div>`;
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
  _generateMarkupElectronList(electronCount) {
    return Array.from({ length: electronCount }, (_, index) => {
      const angle = (360 * index) / electronCount;
      return `<i class="electron" style="--electron-angle: ${angle}deg"></i>`;
    }).join('');
  }
}

export default new ElementCardView();
