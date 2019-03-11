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

  $renderOffer(offer) {
    let element = document.querySelector(`#trip`).content.querySelector(`.trip-point__offers li`).cloneNode(true);
    element.querySelector(`.trip-point__offer`).innerHTML = `${offer.title} +${offer.currency}&nbsp;${offer.price}`;
    return element;
  }

  render() {
    this.$element = this.template.cloneNode(true);
    this.$element.addEventListener(`click`, this._clickHandler);
    this.$element.querySelector(`.trip-icon`).textContent = TripItemIconMap[this._tripItem.type];
    this.$element.querySelector(`.trip-point__title`).textContent = this._tripItem.title;
    let timetable = this.$element.querySelector(`.trip-point__timetable`);
    const timetableStart = `${this._tripItem.timetable.start.getHours()}:${this._tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
    const timetableStop = `${this._tripItem.timetable.stop.getHours()}:${this._tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
    timetable.innerHTML = `${timetableStart}&nbsp;&mdash; ${timetableStop}`;
    let duration = this.$element.querySelector(`.trip-point__duration`);
    duration.textContent = `${Math.trunc(this._tripItem.duration / 60)}h ${this._tripItem.duration % 60}m`;
    this.$element.querySelector(`.trip-point__price`).innerHTML = `${this._tripItem.price.currency}&nbsp;${this._tripItem.price.value}`;
    let offers = this.$element.querySelector(`.trip-point__offers`);
    offers.innerHTML = ``;
    this._tripItem.offers.forEach((offer) => {
      offers.appendChild(this.$renderOffer(offer));
    });
    return this.$element;
  }
}

export default TripItem;
