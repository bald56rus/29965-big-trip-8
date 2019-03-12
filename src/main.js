import {filterContainer, clearFilterContainer, createFilter} from './Filter.js';
import generateTripItems from './TripItems.js';
import TripItem from './TripItem.js';
import TripItemForm from './TripItemForm.js';

const filters = [`Everything`, `Future`, `Past`];
let tripItemsContainer = document.querySelector(`.trip-day__items`);


let filterChangeHandler = () => {
  tripItemsContainer.innerHTML = ``;
  let tripItems = generateTripItems();
  tripItems.forEach((tripItem) => {
    const element = new TripItem(tripItem);
    element.onclick = tripItemClickHandler;
    tripItemsContainer.appendChild(element.render());
  });
};

document.addEventListener(`filter-change`, filterChangeHandler);

const replaceElements = (original, replacement) => {
  original.parentNode.insertBefore(replacement, original.nextSibling);
  original.parentNode.removeChild(original);
};

const formSubmitHandler = (original, model) => {
  const replacement = new TripItem(model);
  replacement.onclick = tripItemClickHandler;
  replaceElements(original, replacement.render());
};

const tripItemClickHandler = (original, model) => {
  const replacement = new TripItemForm(model);
  replacement.onsubmit = formSubmitHandler;
  replaceElements(original, replacement.render());
};

let init = () => {
  clearFilterContainer();
  filters.forEach((filter) => {
    filterContainer.appendChild(createFilter(filter));
  });
  tripItemsContainer.innerHTML = ``;
  const tripItems = generateTripItems();
  tripItems.forEach((tripItem) => {
    const element = new TripItem(tripItem);
    element.onclick = tripItemClickHandler;
    tripItemsContainer.appendChild(element.render());
  });
};

init();
