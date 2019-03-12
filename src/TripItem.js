const TripItemIconMap = {
  "Taxi": `🚕`,
  "Bus": `🚌`,
  "Train": `🚂`,
  "Ship": `🛳️`,
  "Transport": `🚊`,
  "Drive": `🚗`,
  "Flight": `✈️`,
  "Check-in": `🏨`,
  "Sightseeing": `🏛️`,
  "Restaurant": `🍴`,
};

class TripItem {
  constructor(tripItem) {
    this._tripItem = tripItem;
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

  $renderElement(element, content, typeContent = `textContent`) {
    this.$element.querySelector(element)[typeContent] = content;
  }

  $renderOffers(offers) {
    const container = this.$element.querySelector(`.trip-point__offers`);
    const offerTemplate = document.querySelector(`#trip`).content.querySelector(`.trip-point__offers li`);
    container.innerHTML = ``;
    offers.forEach((offer) => {
      const offerElement = offerTemplate.cloneNode(true);
      offerElement.innerHTML = `${offer.title} +${offer.currency}&nbsp;${offer.price}`;
      container.appendChild(offerElement);
    });
  }

  render() {
    this.$element = this.template.cloneNode(true);
    this.$element.addEventListener(`click`, this._clickHandler);
    this.$renderElement(`.trip-icon`, TripItemIconMap[this._tripItem.type]);
    this.$renderElement(`.trip-point__title`, this._tripItem.title);
    let timetable = this.$element.querySelector(`.trip-point__timetable`);
    const timetableStart = `${this._tripItem.timetable.start.getHours()}:${this._tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
    const timetableStop = `${this._tripItem.timetable.stop.getHours()}:${this._tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
    timetable.innerHTML = `${timetableStart}&nbsp;&mdash; ${timetableStop}`;
    this.$renderElement(`.trip-point__duration`, `${Math.trunc(this._tripItem.duration / 60)}h ${this._tripItem.duration % 60}m`);
    this.$renderElement(`.trip-point__price`, `${this._tripItem.price.currency}&nbsp;${this._tripItem.price.value}`, `innerHTML`);
    this.$renderOffers(this._tripItem.offers);
    return this.$element;
  }
}

export default TripItem;
