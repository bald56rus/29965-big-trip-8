import {filterContainer, clearFilterContainer, createFilter} from './Filter.js';
import {tripContainer, clearTripContainer, createTripDay, generateTrip} from './Trip.js';


const filters = [`Everything`, `Future`, `Past`];

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
