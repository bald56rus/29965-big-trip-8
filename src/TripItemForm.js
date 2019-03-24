import Component from "./Component";
import {renderTemplate} from "./Utils";
import flatpickr from 'flatpickr';
import '../node_modules/flatpickr/dist/flatpickr.min.css';

class TripItemForm extends Component {
  constructor(model) {
    super(model);
    this.submitHandler = this.submitHandler.bind(this);
  }

  get template() {
    const template = document
      .querySelector(`#trip-item-form`)
      .content
      .querySelector(`.point`)
      .cloneNode(true);
    template.innerHTML = renderTemplate(template.innerHTML, this.$model);
    template.querySelectorAll(`.travel-way__select-input`).forEach((input) => {
      input.checked = this.$model.title.toLowerCase() === input.value.toLowerCase();
    });
    const offersContainer = template.querySelector(`.point__offers-wrap`);
    offersContainer.innerHTML = ``;
    this.$model.offers.map((offer) => {
      offer.id = () => {
        return offer.title.split(` `).map((w) => w.toLowerCase()).join(`-`);
      };
      const markup =
        `<input class="point__offers-input visually-hidden" type="checkbox" id="{{id}}" name="offer" value="{{id}}">
        <label for="{{id}}" class="point__offers-label">
          <span class="point__offer-service">{{title}}</span> +&euro;
          <span class="point__offer-price">{{price}}</span>
        </label>`;
      const element = document.createElement(`template`);
      element.innerHTML = renderTemplate(markup, offer);
      return element.content;
    })
      .forEach((offer) => offersContainer.appendChild(offer));
    const photosContainer = template.querySelector(`.point__destination-images`);
    photosContainer.innerHTML = ``;
    this.$model.photos.map((photo) => {
      const markup = `<img src="{{src}}" alt="picture from place" class="point__destination-image">`;
      const element = document.createElement(`template`);
      element.innerHTML = renderTemplate(markup, photo);
      return element.content;
    })
      .forEach((photo) => photosContainer.appendChild(photo));
    return template;
  }

  static createMapper(model) {
    return {
      price: (value) => (model.price = value),
      time: (value) => {
        const [start, stop] = value.match(/(\d+:\d+)/g);
        const [startHours, startMinutes] = start.match(/\d+/g);
        const [stopHours, stopMinutes] = stop.match(/\d+/g);
        let diffHours = parseInt(startHours, 10) - model.timetable.start.getHours();
        let diffMinutes = parseInt(startMinutes, 10) - model.timetable.start.getMinutes();
        model.timetable.start = new Date(model.timetable.start.setHours(model.timetable.start.getHours() + diffHours));
        model.timetable.start = new Date(model.timetable.start.setMinutes(model.timetable.start.getMinutes() + diffMinutes));
        diffHours = parseInt(stopHours, 10) - model.timetable.stop.getHours();
        diffMinutes = parseInt(stopMinutes, 10) - model.timetable.stop.getMinutes();
        model.timetable.stop = new Date(model.timetable.stop.setHours(model.timetable.stop.getHours() + diffHours));
        model.timetable.sttop = new Date(model.timetable.stop.setMinutes(model.timetable.stop.getMinutes() + diffMinutes));
      }
    };
  }

  submitHandler(evt) {
    evt.preventDefault();
    const formData = new FormData(this.$form);
    const mapper = TripItemForm.createMapper(this.$model);
    formData.forEach((value, property) => {
      if (typeof mapper[property] !== `undefined`) {
        mapper[property](value);
      }
    });
    const submitEvent = new CustomEvent(`point:save`, {
      'detail': {
        element: this.$element, model: this.$model
      }
    });
    this.$element.dispatchEvent(submitEvent);
  }

  bind() {
    this.$form = this.$element.querySelector(`form`);
    this.$form.addEventListener(`submit`, this.submitHandler);
    const dataPicker = this.$element.querySelector(`.point__date .point__input`);
    flatpickr(dataPicker, {dateFormat: `j M`});
  }
}

export default TripItemForm;
