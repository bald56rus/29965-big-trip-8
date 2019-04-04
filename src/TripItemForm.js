import Component from "./Component";
import {render} from "./Utils";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {cloneDeep} from 'lodash';
import DependenciesContainer from './DependenciesContainer';

class TripItemForm extends Component {
  constructor(model) {
    super(model);
    this._escPressHandler = this._escPressHandler.bind(this);
    this._saveHandler = this._saveHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeTravelWayHandler = this._changeTravelWayHandler.bind(this);
    this._resolveDependencies();
  }

  _resolveDependencies() {
    const _dependencies = new DependenciesContainer();
    this._apiProvider = _dependencies[`apiProvider`];
    this._destinations = _dependencies[`destinations`];
    this._offers = _dependencies[`offers`];
    this._icons = _dependencies[`icons`];
  }

  _renderPictures(pictures) {
    const container = new DocumentFragment();
    pictures
      .map((picture) => {
        const markup = `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image"></img>`;
        const element = document.createElement(`template`);
        element.innerHTML = markup;
        return element.content;
      })
      .forEach((picture) => container.appendChild(picture));
    return container;
  }

  _renderDestination(template, destination) {
    template.querySelector(`.point__destination-text`).textContent = destination.description;
    const picturesContainer = template.querySelector(`.point__destination-images`);
    picturesContainer.innerHTML = ``;
    picturesContainer.appendChild(this._renderPictures(destination.pictures));
  }

  _renderOffer(model) {
    const {title, price, accepted} = model;
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

  _renderOffers(container, offers) {
    offers
      .map((offer) => this._renderOffer(offer))
      .forEach((offer) => container.appendChild(offer));
  }

  get template() {
    const template = document
      .getElementById(`trip-item-form`)
      .content
      .querySelector(`.point`)
      .cloneNode(true);
    template.innerHTML = render(template.innerHTML, this._model);
    const favorite = template.querySelector(`.point__favorite-input`);
    favorite.value = this._model.is_favorite;
    favorite.checked = this._model.is_favorite;
    template.querySelectorAll(`.travel-way__select-input`)
      .forEach((input) => {
        input.checked = this._model.type.toLowerCase() === input.value.toLowerCase();
      });
    this._offerContainer = template.querySelector(`.point__offers-wrap`);
    this._icon = template.querySelector(`.travel-way__label`);
    this._renderOffers(this._offerContainer, this._model.offers);
    this._renderDestination(template, this._model.destination);
    this._saveButton = template.querySelector(`.point__button--save`);
    this._deleteButton = template.querySelector(`button[type="reset"]`);
    return template;
  }

  _createMapper(model) {
    model[`is_favorite`] = false;
    model.offers.forEach((offer) => (offer.accepted = false));
    return {
      'travel-way': (value) => (model.type = value),
      'destination': (value) => {
        model.destination = this._destinations.find((destination) => destination.name === value);
      },
      'date-start': (value) => (model[`date_from`] = Date.parse(value)),
      'date-end': (value) => (model[`date_to`] = Date.parse(value)),
      'price': (value) => (model[`base_price`] = value),
      'favorite': () => (model[`is_favorite`] = true),
      'offer': (value) => {
        const offerElement = model.offers.find((offer) => offer.title === value);
        offerElement.accepted = true;
      }
    };
  }

  _lock() {
    this._element.style.border = `none`;
    this._element.classList.remove(`shake`);
    this._form.disabled = true;
    this._saveButton.disabled = true;
    this._deleteButton.disabled = true;
  }

  _errorApiHandler() {
    this._element.style.border = `1px solid crimson`;
    this._saveButton.textContent = `Save`;
    this._saveButton.disabled = false;
    this._deleteButton.textContent = `Delete`;
    this._deleteButton.disabled = false;
    this._element.classList.add(`shake`);
  }

  set onSave(handler) {
    this._onSave = handler;
  }

  _saveHandler(evt) {
    if (typeof this._onSave === `function`) {
      this._lock();
      this._saveButton.textContent = `Saving...`;
      evt.preventDefault();
      const formData = new FormData(this._form);
      const model = cloneDeep(this._model);
      const mapper = this._createMapper(model);
      formData.forEach((value, property) => {
        if (typeof mapper[property] !== `undefined`) {
          mapper[property](value);
        }
      });
      this._apiProvider.savePoint(model)
        .then(() => (this._onSave(this._element, model)))
        .catch(() => this._errorApiHandler());
    }
  }

  set onDelete(handler) {
    this._onDelete = handler;
  }

  _deleteHandler() {
    if (typeof this._onDelete === `function`) {
      this._lock();
      this._deleteButton.textContent = `Deleting...`;
      this._apiProvider.deletePoint(this._model.id)
        .then(() => this._onDelete(this._element, this._model))
        .catch(() => this._errorApiHandler());
    }
  }

  _changeDestinationHandler(evt) {
    const selected = evt.target.value;
    if (selected !== ``) {
      const destinationElement = this._destinations.find((destination) => destination.name === selected);
      this._renderDestination(this._element, destinationElement);
    }
  }

  _changeTravelWayHandler(evt) {
    this._icon.textContent = this._icons[evt.target.value];
    this._model.offers = [];
    this._offerContainer.innerHTML = ``;
    const input = this._element.querySelector(`.travel-way__toggle`);
    input.checked = false;
    const offersForType = this._offers.find((offer) => offer.type === evt.target.value);
    if (offersForType) {
      const offers = offersForType.offers.map((offer) => {
        return {title: offer.name, price: offer.price};
      });
      this._model.offers = offers;
      this._renderOffers(this._offerContainer, this._model.offers);
    }
  }

  _escPressHandler(evt) {
    if (evt.keyCode === 27) {
      document.removeEventListener(`keydown`, this._escPressHandler);
      this._onSave(this._element, this._model);
    }
  }

  bind() {
    document.addEventListener(`keydown`, this._escPressHandler);
    this._form = this._element.querySelector(`form`);
    this._form.addEventListener(`submit`, this._saveHandler);
    this._form.addEventListener(`reset`, this._deleteHandler);
    const startPicker = this._element.querySelector(`input[name="date-start"]`);
    const stopPicker = this._element.querySelector(`input[name="date-end"]`);
    const pickerOptions = {
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`
    };
    const startPickerOptions = cloneDeep(pickerOptions);
    const stopPickerOptions = cloneDeep(pickerOptions);
    startPickerOptions.defaultDate = this._model.date_from;
    stopPickerOptions.defaultDate = this._model.date_to;
    flatpickr(startPicker, startPickerOptions);
    flatpickr(stopPicker, stopPickerOptions);
    const destinationInput = this._element.querySelector(`#destination`);
    destinationInput.addEventListener(`change`, this._changeDestinationHandler);
    const destinationList = this._element.querySelector(`#destination-select`);
    this._destinations.forEach((destination) => {
      const option = document.createElement(`option`);
      option.value = destination.name;
      destinationList.appendChild(option);
    });
    this._element.querySelectorAll(`.travel-way__select-input`)
      .forEach((input) => {
        input.addEventListener(`change`, this._changeTravelWayHandler);
      });
  }
}

export default TripItemForm;
