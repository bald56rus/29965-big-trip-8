import Component from "./Component";
import {renderTemplate} from './Utils';
import moment from 'moment';

class TripItem extends Component {
  constructor(model) {
    super(model);
    const {timetable} = this._model;
    const {formattedStart, formattedStop, duration} = timetable;
    if (formattedStart === undefined) {
      Object.defineProperty(timetable, `formattedStart`, {
        get() {
          return moment(timetable.start).format(`HH:mm`);
        }
      });
    }
    if (formattedStop === undefined) {
      Object.defineProperty(timetable, `formattedStop`, {
        get() {
          return moment(timetable.stop).format(`HH:mm`);
        }
      });
    }
    if (duration === undefined) {
      Object.defineProperty(timetable, `duration`, {
        get() {
          const {start, stop} = timetable;
          const hours = moment(stop).diff(start, `hours`);
          const minutes = moment(stop).diff(start, `minutes`);
          return `${hours}h ${minutes % 60}m`;
        }
      });
    }
    this._clickHandler = this._clickHandler.bind(this);
  }

  get template() {
    const template = document
      .querySelector(`#trip-point`)
      .content
      .querySelector(`.trip-point`)
      .cloneNode(true);
    template.innerHTML = renderTemplate(template.innerHTML, this._model);
    const offerContainer = template.querySelector(`.trip-point__offers`);
    this._model.offers.map((offer) => {
      const markup =
        `<li>
          <button class="trip-point__offer">{{title}} +&euro;&nbsp;{{price}}</button>
        </li>`;
      const element = document.createElement(`template`);
      element.innerHTML = renderTemplate(markup, offer);
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
