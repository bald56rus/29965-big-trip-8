import generateTripItems from './TripItems';
import Filter from './Filter';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';
import Stats from './Stats';

const PointFilter = {
  'Everything': () => true,
  'Future': (point) => point.date > new Date(),
  'Past': (point) => point.date < new Date()
};
const content = {
  '#table': document.querySelector(`#table`),
  '#stats': document.querySelector(`#stats`)
};
let activeBlock = content[`#table`];

const filterContainer = document.querySelector(`.trip-filter`);
const contentSwitches = document.querySelectorAll(`.view-switch__item`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
let points = [];

const toggleVisibleContent = (evt) => {
  evt.preventDefault();
  const element = evt.target;
  contentSwitches.forEach((switchElement) => {
    switchElement.classList.remove(`view-switch__item--active`);
  });
  element.classList.add(`view-switch__item--active`);
  activeBlock.classList.add(`visually-hidden`);
  activeBlock = content[element.getAttribute(`href`)];
  activeBlock.classList.remove(`visually-hidden`);
};

const replaceElements = (original, replacement) => {
  original.parentNode.insertBefore(replacement, original.nextSibling);
  original.parentNode.removeChild(original);
};

const savePointHandler = (original, model) => {
  const replacement = new TripItem(model);
  replacement.onClick = clickPointHandler;
  replaceElements(original, replacement.render());
};

const deletePointHandler = (element) => {
  element.parentNode.removeChild(element);
};

const clickPointHandler = (original, model) => {
  const replacement = new TripItemForm(model);
  replacement.onSave = savePointHandler;
  replacement.onDelete = deletePointHandler;
  replaceElements(original, replacement.render());
};

const renderPoints = (pointList) => {
  pointsContainer.innerHTML = ``;
  pointList.forEach((point) => {
    const element = new TripItem(point);
    element.onClick = clickPointHandler;
    pointsContainer.appendChild(element.render());
  });
};

const renderStats = (pointList) => {
  const transports = [`🚕 Taxi`, `🚌 Bus`, `🚂 Train`, `🛳 Ship`, `🚊 Transport`, `🚗 Drive`, `✈ Flight`];
  const BAR_HEIGHT = 55;
  moneyCtx.height = BAR_HEIGHT * 6;
  transportCtx.height = BAR_HEIGHT * 4;
  const grouped = pointList.reduce((accumulator, current) => {
    const key = `${current.icon} ${current.title}`;
    let property = accumulator[key];
    if (property) {
      property.totalPrice += current.price;
      property.totalCount += 1;
    } else {
      accumulator[key] = {totalPrice: current.price, totalCount: 1};
    }
    return accumulator;
  }, {});
  const moneyDataset = {};
  const transportDataset = {};
  Object.keys(grouped).forEach((key) => {
    moneyDataset[key] = grouped[key].totalPrice;
    if (transports.includes(key)) {
      transportDataset[key] = grouped[key].totalCount;
    }
  });
  const moneyChartFormatter = (value) => `€ ${value}`;
  const transportChartFormatter = (value) => `${value}x`;
  new Stats(`MONEY`, moneyCtx, moneyDataset, moneyChartFormatter).render();
  new Stats(`TRANSPORT`, transportCtx, transportDataset, transportChartFormatter).render();
};

const renderFilters = () => {
  filterContainer.innerHTML = ``;
  Object.keys(PointFilter).forEach((key) => {
    const filter = new Filter({title: key});
    filter.onClick = () => {
      renderPoints(points.filter(PointFilter[key]));
    };
    filterContainer.appendChild(filter.render());
  });
};

let init = () => {
  contentSwitches.forEach((element) => {
    element.addEventListener(`click`, toggleVisibleContent);
  });
  renderFilters();
  points = generateTripItems();
  renderPoints(points);
  renderStats(points);
};

init();
