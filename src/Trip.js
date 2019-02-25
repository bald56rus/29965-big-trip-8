const container = document.querySelector(`.trip-points`);
const tripDayTemplate = document.querySelector(`#trip`).content;
const tripItemTemplate = tripDayTemplate.querySelector(`.trip-point`);
const itemOfferTemplate = tripItemTemplate.querySelector(`.trip-point__offers li`);


let createItemOffer = (itemOffer) => {
  let newItemOffer = itemOfferTemplate.cloneNode(true);
  newItemOffer.querySelector(`.trip-point__offer`).innerHTML = itemOffer;
  return newItemOffer;
};

let createTripItem = (tripItem) => {
  let newTripItem = tripItemTemplate.cloneNode(true);
  let icon = newTripItem.querySelector(`.trip-icon`);
  icon.textContent = tripItem.icon;
  let title = newTripItem.querySelector(`.trip-point__title`);
  title.textContent = tripItem.title;
  let timetable = newTripItem.querySelector(`.trip-point__timetable`);
  timetable.innerHTML = tripItem.timetable;
  let duration = newTripItem.querySelector(`.trip-point__duration`);
  duration.textContent = tripItem.duration;
  let price = newTripItem.querySelector(`.trip-point__price`);
  price.innerHTML = tripItem.price;
  let offers = newTripItem.querySelector(`.trip-point__offers`);
  offers.innerHTML = ``;
  tripItem.offers.forEach((offer) => {
    offers.appendChild(createItemOffer(offer));
  });
  return newTripItem;
};

let createTripDay = (tripDay) => {
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

let clearContainer = () => {
  container.innerHTML = ``;
};

export {
  container as tripContainer,
  clearContainer as clearTripContainer,
  createTripDay
};
