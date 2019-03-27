import Component from "./Component";
import { render } from './Utils';
import moment from 'moment';

class TripItem extends Component {
  constructor(model) {
    super(model);
    this._clickHandler = this._clickHandler.bind(this);
  }

  _addFields(original) {
    const modified = { ...original };
    const { date_from, formattedStart, date_to, formattedStop, duration } = original;
    if (formattedStart === undefined) {
      Object.defineProperty(modified, `formattedStart`, {
        get() {
          return moment(new Date(date_from)).format(`HH:mm`);
        }
      });
    }
    if (formattedStop === undefined) {
      Object.defineProperty(modified, `formattedStop`, {
        get() {
          return moment(new Date(date_to)).format(`HH:mm`);
        }
      });
    }
    if (duration === undefined) {
      Object.defineProperty(modified, `duration`, {
        get() {
          const hours = moment(new Date(date_to)).diff(new Date(date_from), `hours`);
          const minutes = moment(new Date(date_to)).diff(new Date(date_from), `minutes`);
          return `${hours}h ${minutes % 60}m`;
        }
      });
    }
    return modified;
  }

  get template() {
    const template = document
      .getElementById(`trip-point`)
      .content
      .querySelector(`.trip-point`)
      .cloneNode(true);
    template.innerHTML = render(template.innerHTML, this._addFields(this._model));
    const offerContainer = template.querySelector(`.trip-point__offers`);
    this._model.offers.map((offer) => {
      const markup =
        `<li>
          <button class="trip-point__offer">{{title}} +&euro;&nbsp;{{price}}</button>
        </li>`;
      const element = document.createElement(`template`);
      element.innerHTML = render(markup, offer);
      return element.content;
    }).forEach((offer) => offerContainer.appendChild(offer));
    return template;
  }

  set onClick(handler) {
    this._onCLick = handler;
  }

  _clickHandler() {
    if (typeof this._onCLick === `function`) {
      this._onCLick(this._element, this._model);
    }
  }

  bind() {
    this._element.addEventListener(`click`, this._clickHandler);
  }
}

export default TripItem;
