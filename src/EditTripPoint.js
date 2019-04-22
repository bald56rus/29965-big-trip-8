import Component from "./Component";
import TripOffer from "./TripOffer";
import TripPicture from "./TripPicture";
import {render} from "./Utils";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {cloneDeep} from 'lodash';
import DependenciesContainer from './DependenciesContainer';


const KeyCode = {
  ESC: 27
};

const dayPickerOptions = {
  altInput: true,
  altFormat: `M d`,
  dateFormat: `Z`,
};
const rangePickerOptions = {
  'enableTime': true,
  'time_24hr': true,
  'altInput': true,
  'altFormat': `H:i`,
  'dateFormat': `Z`
};

let form = null;
let dayPicker = null;
let dateFromPicker = null;
let dateToPicker = null;
let saveButton = null;
let deleteButton = null;
let offersContainer = null;

class TripItemForm extends Component {
  constructor(model) {
    super(model);
    this._cancelHandler = this._cancelHandler.bind(this);
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
    pictures.forEach((picture) => container.appendChild(new TripPicture(picture).render()));
    return container;
  }

  _renderDestination(template, destination) {
    template.querySelector(`.point__destination-text`).textContent = destination.description;
    const picturesContainer = template.querySelector(`.point__destination-images`);
    picturesContainer.innerHTML = ``;
    picturesContainer.appendChild(this._renderPictures(destination.pictures));
  }

  _renderOffers(container, offers) {
    offers.forEach((offer) => container.appendChild(new TripOffer(offer).render()));
  }

  get template() {
    const template = document
      .getElementById(`trip-item-form`)
      .content
      .querySelector(`.point`)
      .cloneNode(true);
    template.innerHTML = render(template.innerHTML, this._model);
    form = template.querySelector(`form`);
    dayPicker = template.querySelector(`.point__date .point__input`);
    dayPicker.value = this._model.dateFrom;
    dateFromPicker = template.querySelector(`input[name="date-start"]`);
    dateFromPicker.value = this._model.dateFrom;
    dateToPicker = template.querySelector(`input[name="date-end"]`);
    dateToPicker.value = this._model.dateTo;
    const favorite = template.querySelector(`.point__favorite-input`);
    favorite.value = this._model.is_favorite;
    favorite.checked = this._model.is_favorite;
    template.querySelectorAll(`.travel-way__select-input`)
      .forEach((input) => {
        input.checked = this._model.type.toLowerCase() === input.value.toLowerCase();
      });
    offersContainer = template.querySelector(`.point__offers-wrap`);
    this._icon = template.querySelector(`.travel-way__label`);
    this._renderOffers(offersContainer, this._model.offers);
    this._renderDestination(template, this._model.destination);
    saveButton = template.querySelector(`.point__button--save`);
    deleteButton = template.querySelector(`button[type="reset"]`);
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
      'date-start': (value) => (model.dateFrom = new Date(Date.parse(value))),
      'date-end': (value) => (model.dateTo = new Date(Date.parse(value))),
      'price': (value) => (model.price = parseInt(value, 10)),
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
    form.disabled = true;
    saveButton.disabled = true;
    deleteButton.disabled = true;
  }

  _apiErrorHandler() {
    this._element.style.border = `1px solid crimson`;
    saveButton.textContent = `Save`;
    saveButton.disabled = false;
    deleteButton.textContent = `Delete`;
    deleteButton.disabled = false;
    this._element.classList.add(`shake`);
  }

  set onCancel(handler) {
    this._onCancel = handler;
  }

  set onSave(handler) {
    this._onSave = handler;
  }

  _saveHandler(evt) {
    if (typeof this._onSave === `function`) {
      this._lock();
      saveButton.textContent = `Saving...`;
      evt.preventDefault();
      const formData = new FormData(form);
      const model = cloneDeep(this._model);
      const mapper = this._createMapper(model);
      formData.forEach((value, property) => {
        if (typeof mapper[property] !== `undefined`) {
          mapper[property](value);
        }
      });
      (model.id ? this._apiProvider.savePoint(model) : this._apiProvider.createPoint(model))
        .then((point) => {
          this._onSave(this._element, point);
        })
        .catch(() => this._apiErrorHandler());
    }
  }

  set onDelete(handler) {
    this._onDelete = handler;
  }

  _deleteHandler() {
    if (typeof this._onDelete === `function`) {
      this._lock();
      deleteButton.textContent = `Deleting...`;
      this._apiProvider.deletePoint(this._model.id)
        .then(() => this._onDelete(this._element, this._model))
        .catch(() => this._apiErrorHandler());
    }
  }

  _renderDestinations() {
    const container = this._element.querySelector(`#destination-select`);
    this._destinations.forEach((destination) => {
      const option = document.createElement(`option`);
      option.value = destination.name;
      container.appendChild(option);
    });
  }

  _changeDestinationHandler(evt) {
    const destinationName = evt.target.value;
    if (destinationName !== ``) {
      const newDestination = this._destinations.find((destination) => destination.name === destinationName);
      this._renderDestination(this._element, newDestination);
    }
  }

  _changeTravelWayHandler(evt) {
    this._icon.textContent = this._icons[evt.target.value];
    this._model.offers = [];
    offersContainer.innerHTML = ``;
    const input = this._element.querySelector(`.travel-way__toggle`);
    input.checked = false;
    const offersForType = this._offers.find((offer) => offer.type === evt.target.value);
    if (offersForType) {
      this._model.offers = offersForType.offers.map((offer) => ({title: offer.name, price: offer.price}));
      this._renderOffers(offersContainer, this._model.offers);
    }
  }

  _cancelHandler(evt) {
    if (typeof this._onCancel === `function`) {
      if (evt.keyCode === KeyCode.ESC) {
        document.removeEventListener(`keydown`, this._cancelHandler);
        this._onCancel(this._element, this._model);
      }
    }
  }

  bind() {
    document.addEventListener(`keydown`, this._cancelHandler);
    form.addEventListener(`submit`, this._saveHandler);
    form.addEventListener(`reset`, this._deleteHandler);
    flatpickr(dayPicker, dayPickerOptions);
    flatpickr(dateFromPicker, rangePickerOptions);
    flatpickr(dateToPicker, rangePickerOptions);
    this._renderDestinations();
    this._element.querySelector(`#destination`).addEventListener(`change`, this._changeDestinationHandler);
    this._element.querySelectorAll(`.travel-way__select-input`)
      .forEach((input) => (input.addEventListener(`change`, this._changeTravelWayHandler)));
  }
}

export default TripItemForm;
