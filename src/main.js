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

const submitHandler = (evt) => {
  const {element: original, model} = evt.detail;
  const replacement = new TripItem(model).render();
  replacement.addEventListener(`point:click`, clickHandler);
  replaceElements(original, replacement);
};

const clickHandler = (evt) => {
  const {element: original, model} = evt.detail;
  const replacement = new TripItemForm(model).render();
  replacement.addEventListener(`point:save`, submitHandler);
  replaceElements(original, replacement);
};

let init = () => {
  const filterContainer = document.querySelector(`.trip-filter`);
  filterContainer.innerHTML = ``;
  filters.map((filter) => new Filter({title: filter}).render())
    .forEach((filter) => filterContainer.appendChild(filter));

  tripItemsContainer.innerHTML = ``;
  generateTripItems()
    .forEach((tripItem) => {
      const element = new TripItem(tripItem).render();
      element.addEventListener(`point:click`, clickHandler);
      tripItemsContainer.appendChild(element);
    });
};

init();
