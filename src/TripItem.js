import Component from "./Component";
import {renderTemplate} from './Utils';

class TripItem extends Component {
  constructor(model) {
    if (typeof model.timetable.formattedStart === `undefined`) {
      Object.defineProperty(model.timetable, `formattedStart`, {
        get() {
          const hours = model.timetable.start.getHours();
          const minutes = model.timetable.start.getMinutes();
          return `${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;
        }
      });
    }
    if (typeof model.timetable.formattedStop === `undefined`) {
      Object.defineProperty(model.timetable, `formattedStop`, {
        get() {
          const hours = model.timetable.stop.getHours();
          const minutes = model.timetable.stop.getMinutes();
          return `${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;
        }
      });
    }
    if (typeof model.timetable.duration === `undefined`) {
      Object.defineProperty(model.timetable, `duration`, {
        get() {
          const diff = (model.timetable.stop - model.timetable.start) / 60000;
          const hours = Math.trunc(diff / 60);
          const minutes = diff % 60;
          return `${hours}h ${minutes.toString().padStart(2, `0`)}m`;
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
