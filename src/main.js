import {filterContainer, clearFilterContainer, createFilter} from './Filter.js';
import {tripContainer, clearTripContainer, createTripDay} from './Trip.js';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const filters = [`Everything`, `Future`, `Past`];
const tripDay = {
  caption: `Day`,
  number: 1,
  title: `Mar 18`,
  items: [{
    icon: `🚕`,
    title: `Taxi to Airport`,
    timetable: `10:00&nbsp;&mdash; 11:00`,
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Order UBER +&euro;&nbsp;20`, `Upgrade to business +&euro;&nbsp;20`]
  }, {
    icon: `✈️`,
    title: `Flight to Geneva`,
    timetable: `10:00&nbsp;&mdash; 11:00`,
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Upgrade to business +&euro;&nbsp;20`, `Select meal +&euro;&nbsp;20`]
  }, {
    icon: `🚗`,
    title: `Drive to Chamonix`,
    timetable: `10:00&nbsp;&mdash; 11:00`,
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Rent a car +&euro;&nbsp;200`]
  }, {
    icon: `🏨`,
    title: `Check into a hotel`,
    timetable: `10:00&nbsp;&mdash; 11:00`,
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Add breakfast +&euro;&nbsp;20`]
  }]
};

let filterChangeHandler = () => {
  clearTripContainer();
  for (let i = 1; i <= getRandomInt(1, 5); i++) {
    tripContainer.appendChild(createTripDay(tripDay));
  }
  tripContainer.appendChild(createTripDay(tripDay));
};

document.addEventListener(`filter-change`, filterChangeHandler);

let init = () => {
  clearFilterContainer();
  filters.forEach((filter) => {
    filterContainer.appendChild(createFilter(filter));
  });
  clearTripContainer();
  for (let i = 1; i <= 7; i++) {
    tripContainer.appendChild(createTripDay(tripDay));
  }
};

init();
