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
let pointDate = null;
let travelMode = null;
let travelsModes = null;
let dateFrom = null;
let dateTo = null;
let saveButton = null;
let deleteButton = null;
let offersContainer = null;
let destination = null;
let destinations = [];
let destinationList = null;
let picturesContainer = null;
let pointDatePicker = null;
let dateFromPicker = null;
let dateToPicker = null;

class EditTripPoint extends Component {
  constructor(model) {
    super(model);
    this._cancelHandler = this._cancelHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeTravelModeHandler = this._changeTravelModeHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._saveHandler = this._saveHandler.bind(this);
    this._resolveDependencies();
  }

  bind() {
    document.addEventListener(`keydown`, this._cancelHandler);
    form.addEventListener(`submit`, this._saveHandler);
    form.addEventListener(`reset`, this._deleteHandler);
    pointDatePicker = flatpickr(pointDate, Object.assign({}, dayPickerOptions, {
      onChange(selectedDates, dateStr) {
        let selectedDate = new Date(dateStr);
        let date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0);
        dateFromPicker.set(`minDate`, date);
        dateFromPicker.set(`maxDate`, date);
        dateToPicker.set(`minDate`, date);
      }
    }));
    dateFromPicker = flatpickr(dateFrom, Object.assign({}, rangePickerOptions, {
      minDate: dateFrom.value,
      maxDate: dateFrom.value
    }));
    dateToPicker = flatpickr(dateTo, Object.assign({}, rangePickerOptions, {
      minDate: dateFrom.value
    }));
    this._element.querySelector(`#destination`).addEventListener(`change`, this._changeDestinationHandler);
    travelsModes.forEach((input) => (input.addEventListener(`change`, this._changeTravelModeHandler)));
  }

  static createMapper(model) {
    model[`is_favorite`] = false;
    model.offers.forEach((offer) => (offer.accepted = false));
    return {
      'travel-way': (value) => (model.type = value),
      'destination': (value) => {
        model.destination = destinations.find((destinationItem) => destinationItem.name === value);
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

  set onCancel(handler) {
    this._onCancel = handler;
  }

  set onDelete(handler) {
    this._onDelete = handler;
  }

  set onSave(handler) {
    this._onSave = handler;
  }

  get template() {
    const template = document
      .getElementById(`trip-item-form`)
      .content
      .querySelector(`.point`)
      .cloneNode(true);
    template.innerHTML = render(template.innerHTML, this._model);
    form = template.querySelector(`form`);
    pointDate = template.querySelector(`.point__date .point__input`);
    pointDate.value = this._model.dateFrom;
    travelMode = template.querySelector(`.travel-way__label`);
    travelsModes = template.querySelectorAll(`.travel-way__select-input`);
    travelsModes.forEach((input) => {
      input.checked = this._model.type.toLowerCase() === input.value.toLowerCase();
    });
    destinationList = template.querySelector(`#destination-select`);
    dateFrom = template.querySelector(`input[name="date-start"]`);
    dateFrom.value = this._model.dateFrom;
    dateTo = template.querySelector(`input[name="date-end"]`);
    dateTo.value = this._model.dateTo;
    const favorite = template.querySelector(`.point__favorite-input`);
    favorite.value = this._model.is_favorite;
    favorite.checked = this._model.is_favorite;
    offersContainer = template.querySelector(`.point__offers-wrap`);
    this._icon = template.querySelector(`.travel-way__label`);
    this._renderOffers(this._model.offers);
    destination = template.querySelector(`.point__destination-text`);
    picturesContainer = template.querySelector(`.point__destination-images`);
    this._renderDestination(this._model.destination);
    saveButton = template.querySelector(`.point__button--save`);
    deleteButton = template.querySelector(`button[type="reset"]`);
    return template;
  }

  _errorHandler() {
    this._element.style.border = `1px solid crimson`;
    saveButton.textContent = `Save`;
    saveButton.disabled = false;
    deleteButton.textContent = `Delete`;
    deleteButton.disabled = false;
    this._element.classList.add(`shake`);
  }

  _cancelHandler(evt) {
    if (typeof this._onCancel === `function`) {
      if (evt.keyCode === KeyCode.ESC) {
        document.removeEventListener(`keydown`, this._cancelHandler);
        pointDatePicker.destroy();
        dateFromPicker.destroy();
        dateToPicker.destroy();
        this._onCancel(this._element);
      }
    }
  }

  _changeDestinationHandler(evt) {
    const destinationName = evt.target.value;
    if (destinationName !== ``) {
      const newDestination = destinations.find((destinationItem) => destinationItem.name === destinationName);
      this._renderDestination(newDestination);
    }
  }

  _changeTravelModeHandler(evt) {
    travelMode.textContent = this._icons[evt.target.value];
    this._model.offers = [];
    offersContainer.innerHTML = ``;
    const input = this._element.querySelector(`.travel-way__toggle`);
    input.checked = false;
    const offersForType = this._offers.find((offer) => offer.type === evt.target.value);
    if (offersForType) {
      this._model.offers = offersForType.offers.map((offer) => ({title: offer.name, price: offer.price}));
      this._renderOffers(this._model.offers);
    }
  }

  _deleteHandler() {
    if (typeof this._onDelete === `function`) {
      this._lock();
      deleteButton.textContent = `Deleting...`;
      this._apiProvider.deletePoint(this._model.id)
        .then(() => this._onDelete(this._model.id))
        .catch(() => this._errorHandler());
    }
  }

  _lock() {
    this._element.style.border = `none`;
    this._element.classList.remove(`shake`);
    form.disabled = true;
    saveButton.disabled = true;
    deleteButton.disabled = true;
  }

  _renderDestination(pointDestination) {
    destination.textContent = pointDestination.description;
    picturesContainer.innerHTML = ``;
    picturesContainer.appendChild(this._renderPictures(pointDestination.pictures));
  }

  _renderOffers(offers) {
    offers.forEach((offer) => offersContainer.appendChild(new TripOffer(offer).render()));
  }

  _renderPictures(pictures) {
    const picturesAccumulator = new DocumentFragment();
    pictures.forEach((picture) => picturesAccumulator.appendChild(new TripPicture(picture).render()));
    return picturesAccumulator;
  }

  _resolveDependencies() {
    const _dependenciesContainer = new DependenciesContainer();
    this._apiProvider = _dependenciesContainer.resolve(`apiProvider`);
    _dependenciesContainer.resolve(`destinations`)
      .then((destinationItems) => {
        destinations = destinationItems;
        destinationItems.forEach((destinationItem) => {
          const option = document.createElement(`option`);
          option.value = destinationItem.name;
          destinationList.appendChild(option);
        });
      });
    _dependenciesContainer.resolve(`offers`).then((offers) => (this._offers = offers));
    this._icons = _dependenciesContainer.resolve(`icons`);
  }

  _saveHandler(evt) {
    if (typeof this._onSave === `function`) {
      evt.preventDefault();
      this._lock();
      saveButton.textContent = `Saving...`;
      const formData = new FormData(form);
      const model = cloneDeep(this._model);
      const mapper = EditTripPoint.createMapper(model);
      formData.forEach((value, property) => {
        if (typeof mapper[property] !== `undefined`) {
          mapper[property](value);
        }
      });
      this._model = model;
      EditTripPoint.validate(model)
        .then((validatedModel) => this._apiProvider.savePoint(validatedModel))
        .then((savedPoint) => this._onSave(savedPoint))
        .then(() => {
          pointDatePicker.destroy();
          dateFromPicker.destroy();
          dateToPicker.destroy();
        })
        .catch(() => this._errorHandler());
    }
  }

  static validate(model) {
    let isValid = true;
    isValid = isValid && model.type !== ``;
    isValid = isValid && model.dateTo - model.dateFrom !== 0;
    return (isValid ? Promise.resolve(model) : Promise.reject(`Одно или несколько полей не прошло проверку!`));
  }

}

export default EditTripPoint;
