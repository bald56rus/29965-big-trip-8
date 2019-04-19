import Component from "./Component";

class TripOffer extends Component {
  constructor(model) {
    super(model);
  }

  get template() {
    const {title, price, accepted} = this._model;
    const id = title.split(` `).map((word) => word.toLowerCase()).join(`-`);
    const markup =
      `<input class="point__offers-input visually-hidden" type="checkbox" id="${id}" name="offer" value="${title}" ${accepted ? `checked` : ``}>
        <label for="${id}" class="point__offers-label">
          <span class="point__offer-service">${title}</span> +&euro;
          <span class="point__offer-price">${price}</span>
        </label>`;
    const element = document.createElement(`template`);
    element.innerHTML = markup;
    return element.content;
  }

  bind() {
    this._element.querySelector(`input`).addEventListener(`change`, (evt) => {
      this._model.accepted = evt.target.checked;
      const event = `offer-${evt.target.checked ? `accepted` : `rejected`}`;
      document.dispatchEvent(new CustomEvent(event, {
        bubbles: true,
        detail: this._model
      }));
    });
  }
}

export default TripOffer;
