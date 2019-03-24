import Component from "./Component";
import {renderTemplate} from "./Utils";
import flatpickr from 'flatpickr';
import '../node_modules/flatpickr/dist/flatpickr.min.css';
import {cloneDeep} from 'lodash';

class TripItemForm extends Component {
  constructor(model) {
    super(model);
    this._saveHandler = this._saveHandler.bind(this);
  }

  get template() {
    const template = document
      .querySelector(`#trip-item-form`)
      .content
      .querySelector(`.point`)
      .cloneNode(true);
    template.innerHTML = renderTemplate(template.innerHTML, this._model);
    template.querySelectorAll(`.travel-way__select-input`).forEach((input) => {
      input.checked = this._model.title.toLowerCase() === input.value.toLowerCase();
    });
    const offersContainer = template.querySelector(`.point__offers-wrap`);
    offersContainer.innerHTML = ``;
    this._model.offers.map((offer) => {
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
    this._model.photos.map((photo) => {
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
        const {start: originalStart, stop: originalStop} = model.timetable;
        const [start, stop] = value.split(`—`).map((x) => x.trim());
        let [hours, minutes] = start.split(`:`).map((x) => parseInt(x, 10));
        model.timetable.start = new Date(originalStart.getYear(), originalStart.getMonth(), originalStart.getDate(), hours, minutes);
        [hours, minutes] = stop.split(`:`).map((x) => parseInt(x, 10));
        model.timetable.stop = new Date(originalStop.getYear(), originalStop.getMonth(), originalStop.getDate(), hours, minutes);
      }
    };
  }

  set onSave(handler) {
    this._onSave = handler;
  }

  _saveHandler(evt) {
    if (typeof this._onSave === `function`) {
      evt.preventDefault();
      const formData = new FormData(this._form);
      const model = cloneDeep(this._model);
      const mapper = TripItemForm.createMapper(model);
      formData.forEach((value, property) => {
        if (typeof mapper[property] !== `undefined`) {
          mapper[property](value);
        }
      });
      this._onSave(this._element, model);
    }
  }

  bind() {
    this._form = this._element.querySelector(`form`);
    this._form.addEventListener(`submit`, this._saveHandler);
    const dataPicker = this._element.querySelector(`.point__date .point__input`);
    flatpickr(dataPicker, {dateFormat: `j M`});
  }
}

export default TripItemForm;
