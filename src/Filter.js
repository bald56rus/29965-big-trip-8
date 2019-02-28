const container = document.querySelector(`.trip-filter`);
const template = document.querySelector(`#filter`).content;

let createFilter = (filter) => {
  let changeEvent = new CustomEvent(`filter-change`, {detail: filter});
  let newFilter = template.cloneNode(true);
  const filterId = `filter-${filter.toLowerCase()}`;
  let input = newFilter.querySelector(`input`);
  input.id = filterId;
  input.value = filter.toLowerCase();
  let label = newFilter.querySelector(`label`);
  label.setAttribute(`for`, filterId);
  label.textContent = filter;
  input.addEventListener(`change`, () => {
    document.dispatchEvent(changeEvent);
  });
  return newFilter;
};

let clearContainer = () => {
  container.innerHTML = ``;
};

export {
  container as filterContainer,
  clearContainer as clearFilterContainer,
  createFilter,
};
