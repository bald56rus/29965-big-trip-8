import {getRandom, shuffleArray} from './Utils.js';
const container = document.querySelector(`.trip-points`);
const tripDayTemplate = document.querySelector(`#trip`).content;
const tripItemTemplate = tripDayTemplate.querySelector(`.trip-point`);
const itemOfferTemplate = tripItemTemplate.querySelector(`.trip-point__offers li`);
const TripItemIconMap = {
  "Taxi": `🚕`,
  "Bus": `🚌`,
  "Train": `🚂`,
  "Ship": `🛳️`,
  "Transport": `🚊`,
  "Drive": `🚗`,
  "Flight": `✈️`,
  "Check-in": `🏨`,
  "Sightseeing": `🏛️`,
  "Restaurant": `🍴`,
};
const tripTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`,
  `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const tripDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const tripOffers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];
const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

const generateTripItem = (timetableStart) => {
  let tripItem = {};
  let type = `${shuffleArray(tripTypes)[0]}`;
  tripItem.type = type;
  tripItem.title = type;
  tripItem.description = shuffleArray(tripDescriptions).slice(0, getRandom(1, 3)).join(` `);
  let duration = getRandom(61, 120);
  const timetableStop = new Date(timetableStart);
  timetableStop.setMinutes(timetableStop.getMinutes() + duration);
  tripItem.timetable = {
    start: new Date(timetableStart),
    stop: new Date(timetableStop)
  };
  tripItem.duration = duration;
  tripItem.price = `&euro;&nbsp;${getRandom(10, 100)}`;
  let offers = shuffleArray(tripOffers)
    .slice(0, getRandom(0, 2))
    .map((offer) => {
      return {title: offer, price: `&euro;&nbsp;${getRandom(10, 100)}`};
    });
  tripItem.offers = offers;
  tripItem.photos = [];
  return tripItem;
};

const generateTripItems = () => {
  const tripItems = [];
  const itemsCount = getRandom(1, 3);
  let now = new Date();
  let timetableStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  timetableStart.setMinutes(600);
  for (let i = 0; i < itemsCount; i++) {
    let item = generateTripItem(timetableStart);
    timetableStart = item.timetable.stop;
    tripItems.push(item);
  }
  return tripItems;
};

const generateTrip = () => {
  const daysCount = getRandom(1, 3);
  const tripDays = [];
  let now = new Date();
  for (let i = 1; i <= daysCount; i++) {
    let tripDay = {
      number: i,
      caption: `Day`,
      title: `${months[now.getMonth()]} ${now.getDate()}`
    };
    tripDay.items = generateTripItems();
    tripDays.push(tripDay);
    now.setDate(now.getDate() + 1);
    now = new Date(now);
  }
  return tripDays;
};

const createItemOffer = (tripOffer) => {
  let newItemOffer = itemOfferTemplate.cloneNode(true);
  let offer = `${tripOffer.title} +${tripOffer.price}`;
  newItemOffer.querySelector(`.trip-point__offer`).innerHTML = offer;
  return newItemOffer;
};

const createTripItem = (tripItem) => {
  let newTripItem = tripItemTemplate.cloneNode(true);
  let icon = newTripItem.querySelector(`.trip-icon`);
  icon.textContent = TripItemIconMap[tripItem.type];
  let title = newTripItem.querySelector(`.trip-point__title`);
  title.textContent = tripItem.title;
  let timetable = newTripItem.querySelector(`.trip-point__timetable`);
  const timetableStart = `${tripItem.timetable.start.getHours()}:${tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
  const timetableStop = `${tripItem.timetable.stop.getHours()}:${tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
  timetable.innerHTML = `${timetableStart}&nbsp;&mdash; ${timetableStop}`;
  let duration = newTripItem.querySelector(`.trip-point__duration`);
  duration.textContent = `${Math.trunc(tripItem.duration / 60)}h ${tripItem.duration % 60}m`;
  let price = newTripItem.querySelector(`.trip-point__price`);
  price.innerHTML = tripItem.price;
  let offers = newTripItem.querySelector(`.trip-point__offers`);
  offers.innerHTML = ``;
  tripItem.offers.forEach((offer) => {
    offers.appendChild(createItemOffer(offer));
  });
  return newTripItem;
};

const createTripDay = (tripDay) => {
  let newTripDay = tripDayTemplate.cloneNode(true);
  let caption = newTripDay.querySelector(`.trip-day__caption`);
  caption.textContent = tripDay.day;
  let number = newTripDay.querySelector(`.trip-day__number`);
  number.textContent = tripDay.number;
  let title = newTripDay.querySelector(`.trip-day__title`);
  title.textContent = tripDay.title;
  let tripItems = newTripDay.querySelector(`.trip-day__items`);
  tripItems.innerHTML = ``;
  tripDay.items.forEach((item) => {
    tripItems.appendChild(createTripItem(item));
  });
  return newTripDay;
};

const clearContainer = () => {
  container.innerHTML = ``;
};

export {
  container as tripContainer,
  clearContainer as clearTripContainer,
  createTripDay,
  generateTrip
};
