import generateTripItems from './TripItems';
import Filter from './Filter';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';

const filters = [`Everything`, `Future`, `Past`];
let tripItemsContainer = document.querySelector(`.trip-day__items`);

const replaceElements = (original, replacement) => {
  original.parentNode.insertBefore(replacement, original.nextSibling);
  original.parentNode.removeChild(original);
};

const savePointHandler = (original, model) => {
  const replacement = new TripItem(model);
  replacement.onClick = clickPointHandler;
  replaceElements(original, replacement.render());
};

const clickPointHandler = (original, model) => {
  const replacement = new TripItemForm(model);
  replacement.onSave = savePointHandler;
  replaceElements(original, replacement.render());
};

let init = () => {
  const filterContainer = document.querySelector(`.trip-filter`);
  filterContainer.innerHTML = ``;
  filters.map((filter) => new Filter({title: filter}).render())
    .forEach((filter) => filterContainer.appendChild(filter));

  tripItemsContainer.innerHTML = ``;
  generateTripItems()
    .forEach((tripItem) => {
      const element = new TripItem(tripItem);
      element.onClick = clickPointHandler;
      tripItemsContainer.appendChild(element.render());
    });
};

init();
