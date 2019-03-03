import {filterContainer, clearFilterContainer, createFilter} from './Filter.js';
import {tripContainer, clearTripContainer, createTripDay, generateTrip} from './Trip.js';
import {getRandom} from './Utils.js';

const filters = [`Everything`, `Future`, `Past`];
// const tripDay = {
//   caption: `Day`,
//   number: 1,
//   title: `Mar 18`,
//   items: [{
//     type: `Taxi`,
//     title: `Taxi to Airport`,
//     description: ``,
//     photos: [],
//     timetable: {
//       start: new Date(2019, 3, 18, 10),
//       stop: new Date(2019, 3, 18, 11)
//     },
//     duration: 90,
//     price: `&euro;&nbsp;20`,
//     offers: [
//       {title: `Order UBER`, price: `&euro;&nbsp;20`},
//       {title: `Upgrade to business`, price: `&euro;&nbsp;20`}]
//   }, {
//     type: `Flight`,
//     title: `Flight to Geneva`,
//     description: ``,
//     photos: [],
//     timetable: {
//       start: new Date(2019, 3, 18, 10),
//       stop: new Date(2019, 3, 18, 11)
//     },
//     duration: 90,
//     price: `&euro;&nbsp;20`,
//     offers: [
//       {title: `Upgrade to business`, price: `&euro;&nbsp;20`},
//       {title: `Select meal`, price: `&euro;&nbsp;20`}]
//   }, {
//     type: `Drive`,
//     title: `Drive to Chamonix`,
//     description: ``,
//     photos: [],
//     timetable: {
//       start: new Date(2019, 3, 18, 10),
//       stop: new Date(2019, 3, 18, 11)
//     },
//     duration: 90,
//     price: `&euro;&nbsp;20`,
//     offers: [{title: `Rent a car`, price: `&euro;&nbsp;200`}]
//   }, {
//     type: `Check-in`,
//     title: `Check into a hotel`,
//     description: ``,
//     photos: [],
//     timetable: {
//       start: new Date(2019, 3, 18, 10),
//       stop: new Date(2019, 3, 18, 11)
//     },
//     duration: 90,
//     price: `&euro;&nbsp;20`,
//     offers: [{title: `Add breakfast`, price: `&euro;&nbsp;20`}]
//   }]
// };

let filterChangeHandler = () => {
  clearTripContainer();
  let tripDays = generateTrip();
  tripDays.forEach((tripDay) => {
    tripContainer.appendChild(createTripDay(tripDay));
  });
};

document.addEventListener(`filter-change`, filterChangeHandler);

let init = () => {
  clearFilterContainer();
  filters.forEach((filter) => {
    filterContainer.appendChild(createFilter(filter));
  });
  clearTripContainer();
  let tripDays = generateTrip();
  tripDays.forEach((tripDay) => {
    tripContainer.appendChild(createTripDay(tripDay));
  });
};

init();
