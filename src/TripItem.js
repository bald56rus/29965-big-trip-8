import TripItemBase from "./TripItemBase.js";

class TripItem extends TripItemBase {
  constructor(tripItem) {
    super(tripItem);
    this._clickHandler = this._clickHandler.bind(this);
  }

  get template() {
    return document.querySelector(`#trip`).content.querySelector(`.trip-point`);
  }

  _clickHandler() {
    if (typeof this._onclick === `function`) {
      this._onclick(this.$element, this._tripItem);
    }
  }

  set onclick(handler) {
    this._onclick = handler;
  }

  $renderOffer(offer) {
    const offerItem = document.createElement(`li`);
    const offerBtn = document.createElement(`button`);
    offerBtn.classList.add(`trip-point__offer`);
    offerBtn.innerHTML = `${offer.title} +${offer.currency}&nbsp;${offer.price}`;
    offerItem.appendChild(offerBtn);
    return offerItem;
  }

  renderCustomElements() {
    const container = this.$element.querySelector(`.trip-point__offers`);
    container.innerHTML = ``;
    this._tripItem.offers.forEach((offer) => {
      container.appendChild(this.$renderOffer(offer));
    });
  }

  bindEventListeners() {
    this.$element.addEventListener(`click`, this._clickHandler);
  }
}

export default TripItem;
