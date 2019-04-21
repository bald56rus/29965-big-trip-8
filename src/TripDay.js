import Component from "./Component";

class TripDay extends Component {
  constructor(model) {
    super(model);
  }

  get template() {
    const {index, day} = this._model;
    const markup =
    `<section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${index}</p>
          <h2 class="trip-day__title">${day}</h2>
        </article>
        <div class="trip-day__items">
        </div>
    </section>`;
    const element = document.createElement(`template`);
    element.innerHTML = markup;
    return element.content;
  }
}

export default TripDay;
