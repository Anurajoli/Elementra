class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._markup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length < 1))
      return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // 1. Create a detached virtual DOM fragment safely
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // 2. Start the recursive deep diffing process from the parent element
    this._diff(this._parentEl, newDOM);
  }

  _diff(currentParent, newParent) {
    const currentChildren = Array.from(currentParent.childNodes);
    const newChildren = Array.from(newParent.childNodes);

    const maxLength = Math.max(currentChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      const curEl = currentChildren[i];
      const newEl = newChildren[i];

      // Case 1: Node was removed in the new markup
      if (curEl && !newEl) {
        curEl.remove();
        continue;
      }

      // Case 2: Node is completely new, append it
      if (!curEl && newEl) {
        currentParent.appendChild(newEl.cloneNode(true));
        continue;
      }

      // Case 3: Node types are different (e.g., changed from <div> to <p>), replace it entirely
      if (
        curEl.nodeType !== newEl.nodeType ||
        curEl.nodeName !== newEl.nodeName
      ) {
        curEl.replaceWith(newEl.cloneNode(true));
        continue;
      }

      // Case 4: It's a text node or comment node, check if text content changed
      if (
        curEl.nodeType === Node.TEXT_NODE ||
        curEl.nodeType === Node.COMMENT_NODE
      ) {
        if (curEl.nodeValue !== newEl.nodeValue) {
          curEl.nodeValue = newEl.nodeValue;
        }
        continue;
      }

      // Case 5: It's an element node. Sync its attributes and recursively diff its children
      if (curEl.nodeType === Node.ELEMENT_NODE) {
        this._syncAttributes(curEl, newEl);
        this._diff(curEl, newEl); // Deep dive into the children
      }
    }
  }

  _syncAttributes(curEl, newEl) {
    const curAttrs = curEl.attributes;
    const newAttrs = newEl.attributes;

    // 1. Add or update attributes from the new element
    for (const attr of Array.from(newAttrs)) {
      if (curEl.getAttribute(attr.name) !== attr.value) {
        curEl.setAttribute(attr.name, attr.value);
      }
    }

    // 2. Remove attributes that don't exist in the new element anymore
    for (const attr of Array.from(curAttrs)) {
      if (!newEl.hasAttribute(attr.name)) {
        curEl.removeAttribute(attr.name);
      }
    }
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

  renderError(title = 'Title is not set.', msg) {
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
