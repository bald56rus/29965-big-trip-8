import Component from "./Component";
import {renderTemplate} from "./Utils";

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

  submitHandler(evt) {
    evt.preventDefault();
    const submitEvent = new CustomEvent(`point:save`, {
      'detail': {
        element: this.$element, model: this.$model
      }
    });
    this.$element.dispatchEvent(submitEvent);
  }

  bind() {
    this.$element.querySelector(`form`).addEventListener(`click`, this.submitHandler);
  }
}

export default TripItemForm;
