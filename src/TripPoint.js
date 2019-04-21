import Component from "./Component";
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {render} from './Utils';

class TripPoint extends Component {
  constructor(model) {
    super(model);
    this._clickHandler = this._clickHandler.bind(this);
  }

  _defineServiceFields(model) {
    const mappedModel = cloneDeep(model);
    const {dateFrom, dateTo} = mappedModel;
    mappedModel.formattedStart = moment(dateFrom).format(`HH:mm`);
    mappedModel.formattedStop = moment(dateTo).format(`HH:mm`);
    Object.defineProperties(mappedModel, {
      'duration': {
        get() {
          let result = ``;
          const duration = moment.duration(moment(dateTo).diff(dateFrom));
          const days = duration.get(`days`);
          result += days > 0 ? days.toString().padStart(2, `0`).concat(`D `) : ``;
          const hours = duration.get(`hours`);
          result += hours > 0 ? hours.toString().padStart(2, `0`).concat(`H `) : ``;
          const minutes = duration.get(`minutes`);
          result += minutes.toString().padStart(2, `0`).concat(`M`);
          return result;
        }
      }
    });
    return mappedModel;
  }

  get template() {
    const template = document
      .getElementById(`trip-point`)
      .content
      .querySelector(`.trip-point`)
      .cloneNode(true);
    template.innerHTML = render(template.innerHTML, this._defineServiceFields(this._model));
    const offerContainer = template.querySelector(`.trip-point__offers`);
    this._model.offers.slice(0, 2).map((offer) => {
      const {title, price} = offer;
      const element = document.createElement(`template`);
      element.innerHTML = `<li><button class="trip-point__offer">${title} +&euro;&nbsp;${price}</button></li>`;
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

export default TripPoint;
