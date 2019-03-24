import Component from "./Component";
import {renderTemplate} from './Utils';
import moment from 'moment';

class TripItem extends Component {
  constructor(model) {
    if (typeof model.timetable.formattedStart === `undefined`) {
      Object.defineProperty(model.timetable, `formattedStart`, {
        get() {
          return moment(model.timetable.start).format(`HH:mm`);
        }
      });
    }
    if (typeof model.timetable.formattedStop === `undefined`) {
      Object.defineProperty(model.timetable, `formattedStop`, {
        get() {
          return moment(model.timetable.stop).format(`HH:mm`);
        }
      });
    }
    if (typeof model.timetable.duration === `undefined`) {
      Object.defineProperty(model.timetable, `duration`, {
        get() {
          const {start, stop} = model.timetable;
          const hours = moment(stop).diff(start, `hours`);
          const minutes = moment(stop).diff(start, `minutes`);
          return `${hours}h ${minutes % 60}m`;
        }
      });
    }
    super(model);
    this.clickHandler = this.clickHandler.bind(this);
  }

  get template() {
    const template = document
      .querySelector(`#trip-point`)
      .content
      .querySelector(`.trip-point`)
      .cloneNode(true);
    template.innerHTML = renderTemplate(template.innerHTML, this.$model);
    const offerContainer = template.querySelector(`.trip-point__offers`);
    this.$model.offers.map((offer) => {
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

  clickHandler() {
    const clickEvent = new CustomEvent(`point:click`, {
      'detail': {
        element: this.$element, model: this.$model
      }
    });
    this.$element.dispatchEvent(clickEvent);
  }

  bind() {
    this.$element.addEventListener(`click`, this.clickHandler);
  }
}

export default TripItem;
