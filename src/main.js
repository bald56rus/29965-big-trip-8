import {filterContainer, clearFilterContainer, createFilter} from './Filter';
import generateTripItems from './TripItems';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';
import offer from './Offer';
import offer2 from './Offer2';
import photo from './Photo';
import Components from './Components';

const filters = [`Everything`, `Future`, `Past`];
let tripItemsContainer = document.querySelector(`.trip-day__items`);


let filterChangeHandler = () => {
  tripItemsContainer.innerHTML = ``;
  let tripItems = generateTripItems();
  tripItems.forEach((tripItem) => {
    const element = new TripItem(tripItem);
    element.onclick = clickHandler;
    tripItemsContainer.appendChild(element.render());
  });
};

document.addEventListener(`filter-change`, filterChangeHandler);

const replaceElements = (original, replacement) => {
  original.parentNode.insertBefore(replacement, original.nextSibling);
  original.parentNode.removeChild(original);
};

const submitHandler = (evt) => {
  const {element: original, model} = evt.detail;
  const replacement = new TripItem(model).render();
  replacement.addEventListener(`point-click`, clickHandler);
  replaceElements(original, replacement);
};

const clickHandler = (evt) => {
  const {element: original, model} = evt.detail;
  const replacement = new TripItemForm(model).render();
  replacement.addEventListener(`point-save`, submitHandler);
  replaceElements(original, replacement);
};

let init = () => {
  const components = new Components();
  components.register(`offer`, offer);
  components.register(`offer2`, offer2);
  components.register(`photo`, photo);
  clearFilterContainer();
  filters.forEach((filter) => {
    filterContainer.appendChild(createFilter(filter));
  });
  tripItemsContainer.innerHTML = ``;
  const tripItems = generateTripItems();
  tripItems.forEach((tripItem) => {
    const element = new TripItem(tripItem).render();
    element.addEventListener(`point-click`, clickHandler);
    tripItemsContainer.appendChild(element);
  });
};

init();
