class TripItemForm {
  constructor(tripItem) {
    this._tripItem = tripItem;
    this._submitHandler = this._submitHandler.bind(this);
    this._resetHandler = this._resetHandler.bind(this);
  }

  get template() {
    return document.querySelector(`#trip-item-form`).content.querySelector(`.point`);
  }

  set onsubmit(handler) {
    this._onsubmit = handler;
  }

  _submitHandler(evt) {
    if (typeof this._onsubmit === `function`) {
      evt.preventDefault();
      this._onsubmit(this.$element, this._tripItem);
    }
  }

  set onreset(handler) {
    this._onreset = handler;
  }

  _resetHandler(evt) {
    if (typeof this._onreset === `function`) {
      evt.preventDefault();
      this._onreset(this.$element, this._tripItem);
    }
  }

  $renderOffer(offer) {
    const container = new DocumentFragment();
    const offerId = offer.title.split(` `).join(`-`);
    const input = document.createElement(`input`);
    input.type = `checkbox`;
    input.name = `offer`;
    input.classList.add(`point__offers-input`, `visually-hidden`);
    input.id = offerId;
    input.value = offerId;
    container.appendChild(input);
    const label = document.createElement(`label`);
    label.htmlFor = offerId;
    label.classList.add(`point__offers-label`);
    label.innerHTML = `<span class="point__offer-service">${offer.title}</span> + ${offer.currency}<span class="point__offer-price">${offer.price}</span>`;
    container.appendChild(label);
    return container;
  }

  $renderOffers(offers) {
    const container = this.$element.querySelector(`.point__offers-wrap`);
    container.innerHTML = ``;
    offers.forEach((offer) => {
      container.appendChild(this.$renderOffer(offer));
    });

  }

  $renderPhotos(photos) {
    const container = this.$element.querySelector(`.point__destination-images`);
    container.innerHTML = ``;
    photos.forEach((photo) => {
      const photoElement = document.createElement(`img`);
      photoElement.alt = `picture from place`;
      photoElement.classList.add(`point__destination-image`);
      photoElement.src = photo;
      container.appendChild(photoElement);
    });
  }

  $renderElement(element, content, typeContent = `textContent`) {
    this.$element.querySelector(element)[typeContent] = content;
  }

  render() {
    this.$element = this.template.cloneNode(true);
    const form = this.$element.querySelector(`form`);
    form.addEventListener(`submit`, this._submitHandler);
    form.addEventListener(`reset`, this._submitHandler);
    this.$renderElement(`.point__destination-text`, this._tripItem.description);
    this.$element.querySelectorAll(`.travel-way__select-input`).forEach((input) => {
      input.checked = input.value.toLowerCase() === this._tripItem.type.toLowerCase();
    });
    const timetableStart = `${this._tripItem.timetable.start.getHours()}:${this._tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
    const timetableStop = `${this._tripItem.timetable.stop.getHours()}:${this._tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
    this.$renderElement(`.point__time .point__input`, `${timetableStart} — ${timetableStop}`, `value`);
    this.$renderElement(`.point__price .point__price-currency`, this._tripItem.price.currency, `innerHTML`);
    this.$renderElement(`.point__price .point__input`, this._tripItem.price.value, `value`);
    this.$renderOffers(this._tripItem.offers);
    this.$renderPhotos(this._tripItem.photos);
    return this.$element;
  }
}

export default TripItemForm;
