class TripItemForm {
  constructor(tripItem) {
    this._tripItem = tripItem;
    this.$element = null;
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
    let input = document.createElement(`input`);
    input.type = `checkbox`;
    input.name = `offer`;
    input.classList.add(`point__offers-input`, `visually-hidden`);
    input.id = offerId;
    input.value = offerId;
    container.appendChild(input);
    let label = document.createElement(`label`);
    label.htmlFor = offerId;
    label.classList.add(`point__offers-label`);
    label.innerHTML = `<span class="point__offer-service">${offer.title}</span> + ${offer.currency}<span class="point__offer-price">${offer.price}</span>`;
    container.appendChild(label);
    return container;
  }

  $renderPhoto(photo) {
    let img = document.createElement(`img`);
    img.alt = `picture from place`;
    img.classList.add(`point__destination-image`);
    img.src = photo;
    return img;
  }

  render() {
    this.$element = this.template.cloneNode(true);
    const form = this.$element.querySelector(`form`);
    form.addEventListener(`submit`, this._submitHandler);
    form.addEventListener(`reset`, this._submitHandler);
    this.$element.querySelector(`.point__destination-text`).textContent = this._tripItem.description;
    this.$element.querySelectorAll(`.travel-way__select-input`).forEach((element) => {
      element.checked = element.value.toLowerCase() === this._tripItem.type.toLowerCase();
    });
    let timetable = this.$element.querySelector(`.point__time .point__input`);
    const timetableStart = `${this._tripItem.timetable.start.getHours()}:${this._tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
    const timetableStop = `${this._tripItem.timetable.stop.getHours()}:${this._tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
    timetable.value = `${timetableStart} — ${timetableStop}`;
    this.$element.querySelector(`.point__price .point__price-currency`).innerHTML = this._tripItem.price.currency;
    this.$element.querySelector(`.point__price .point__input`).value = this._tripItem.price.value;
    const offerContainer = this.$element.querySelector(`.point__offers-wrap`);
    offerContainer.innerHTML = ``;
    this._tripItem.offers.forEach((offer) => {
      offerContainer.appendChild(this.$renderOffer(offer));
    });
    let photoContainer = this.$element.querySelector(`.point__destination-images`);
    photoContainer.innerHTML = ``;
    this._tripItem.photos.forEach((url) => {
      photoContainer.appendChild(this.$renderPhoto(url));
    });
    return this.$element;
  }
}

export default TripItemForm;
