import generateTripItems from './TripItems';
import Filter from './Filter';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';
import Stats from './Stats';

const PointFilter = {
  'Everything': () => true,
  'Future': (point) => point.date > new Date(),
  'Past': (point) => point.date <= new Date()
};
const content = {
  '#table': document.getElementById(`table`),
  '#stats': document.getElementById(`stats`)
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

const statsReducer = (accumulator, current) => {
  const key = `${current.icon} ${current.title}`;
  let property = accumulator[key];
  if (property) {
    property.totalPrice += current.price;
    property.totalCount += 1;
  } else {
    accumulator[key] = {totalPrice: current.price, totalCount: 1};
  }
  return accumulator;
};

const renderStats = (pointList) => {
  const BAR_HEIGHT = 55;
  const transports = [`🚕 Taxi`, `🚌 Bus`, `🚂 Train`, `🛳 Ship`, `🚊 Transport`, `🚗 Drive`, `✈ Flight`];
  const moneyStats = {};
  const transportStats = {};
  const summaryStats = pointList.reduce(statsReducer, {});
  Object.keys(summaryStats).forEach((key) => {
    moneyStats[key] = summaryStats[key].totalPrice;
    if (transports.includes(key)) {
      transportStats[key] = summaryStats[key].totalCount;
    }
  });
  moneyCtx.height = BAR_HEIGHT * Object.keys(moneyStats).length;
  transportCtx.height = BAR_HEIGHT * Object.keys(transportStats).length;
  const moneyChartCfg = {
    chartTitle: `MONEY`,
    canvas: moneyCtx,
    dataset: moneyStats,
    formatter: (value) => `€ ${value}`
  };
  new Stats(moneyChartCfg).render();
  const transportChartCfg = {
    chartTitle: `TRANSPORT`,
    canvas: transportCtx,
    dataset: transportStats,
    formatter: (value) => `${value}x`
  };
  new Stats(transportChartCfg).render();
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
