class Offer {
  constructor(offer) {
    this._title = offer.title;
    this._currency = offer.currency;
    this._price = offer.price;
    Object.defineProperty(this, `_id`, {
      get() {
        return this._title.split(` `).map((word) => word.toLowerCase()).join(`-`);
      }
    });
  }

  get template() {
    const template =
      `<input class="point__offers-input visually-hidden" type="checkbox" id="${this._id}}" name="offer" value="${this._id}">
    <label for="${this._id}" class="point__offers-label">
      <span class="point__offer-service">${this._title}</span> + ${this._currency}
      <span class="point__offer-price">${this._price}</span>
    </label>`;
    return template;
  }

  render() {
    const container = document.createElement(`template`);
    container.innerHTML = this.template;
    return container.content;
  }
}

export default Offer;
