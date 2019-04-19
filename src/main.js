import Filter from './Filter';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';
import Stats from './Stats';
import ApiProvider from './ApiProvider';
import DependenciesContainer from './DependenciesContainer';
import moment from 'moment';

const PointFilter = {
  'everything': () => true,
  'future': (point) => point.date_from > new Date(),
  'past': (point) => point.date_to <= new Date()
};

const sortBy = (key) => {
  return (a, b) => {
    const first = a[key];
    const second = b[key];
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  };
};

const PointSort = {
  event: sortBy(`type`),
  time: sortBy(`date_from`),
  price: sortBy(`base_price`)
};

let activeFilter = PointFilter[document.querySelector(`[name="filter"]:checked`).value];
let activeSort = PointSort[document.querySelector(`[name="trip-sorting"]:checked`).value];

const container = {
  '#table': document.getElementById(`table`),
  '#stats': document.getElementById(`stats`)
};
const totalPrice = document.querySelector(`.trip__total-cost`);
let activeContainer = container[`#table`];
const filterContainer = document.querySelector(`.trip-filter`);
const contentSwitches = document.querySelectorAll(`.view-switch__item`);
let pointsContainer = null;
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeCtx = document.querySelector(`.statistic__time-spend`);
const Icons = {
  "taxi": `🚕`,
  "bus": `🚌`,
  "train": `🚂`,
  "ship": `🛳️`,
  "transport": `🚊`,
  "drive": `🚗`,
  "flight": `✈️`,
  "check-in": `🏨`,
  "sightseeing": `🏛️`,
  "restaurant": `🍴`,
};
const depenendencies = new DependenciesContainer();
depenendencies.register(`icons`, Icons);
let points = [];
const apiProvider = new ApiProvider({
  baseUrl: `https://es8-demo-srv.appspot.com/big-trip`,
  headers: {'Authorization': `Basic eo0w590ik29889b`}
});
depenendencies.register(`apiProvider`, apiProvider);

const toggleVisibleContent = (evt) => {
  evt.preventDefault();
  const element = evt.target;
  contentSwitches.forEach((switchElement) => {
    switchElement.classList.remove(`view-switch__item--active`);
  });
  element.classList.add(`view-switch__item--active`);
  activeContainer.classList.add(`visually-hidden`);
  activeContainer = container[element.getAttribute(`href`)];
  activeContainer.classList.remove(`visually-hidden`);
};

const replaceElements = (original, replacement) => {
  original.parentNode.insertBefore(replacement, original.nextSibling);
  original.parentNode.removeChild(original);
};

const removePoint = (savedPoints, pointId) => {
  return savedPoints.filter((point) => point.id !== pointId);
};

const addPointHandler = () => {
  const point = {
    type: ``,
    offers: [],
    destination: {
      pictures: []
    }
  };
  pointsContainer.insertBefore(new TripItemForm(point).render(), pointsContainer.firstChild);
};

document.querySelector(`.new-event`).addEventListener(`click`, addPointHandler);

const clickPointHandler = (original, model) => {
  const replacement = new TripItemForm(model);
  replacement.onSave = savePointHandler;
  replacement.onDelete = deletePointHandler;
  replaceElements(original, replacement.render());
};

const deletePointHandler = (element, model) => {
  points = removePoint(points, model);
  element.parentNode.removeChild(element);
};

const savePointHandler = (original, model) => {
  points = removePoint(points, model.id);
  points.push(model);
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderPoints(pointsContainer, sorted);
};

const clearContainer = (targetContainer) => {
  targetContainer.innerHTML = ``;
};

const renderPoints = (targetContainer, pointList) => {
  pointList
    .forEach((point) => {
      const element = new TripItem(point);
      element.onClick = clickPointHandler;
      targetContainer.appendChild(element.render());
    });
};

const filterPoints = (pointList, fn) => {
  return pointList.filter(fn);
};

const sortPoints = (pointList, fn) => {
  return pointList.sort(fn);
};

const calculateStats = (pointList) => {
  const stats = {
    price: 0,
    money: {},
    transport: {},
    time: {}
  };
  pointList.reduce((accumulator, current) => {
    accumulator.price += current[`base_price`];
    if (!accumulator.money[current.type]) {
      accumulator.money[current.type] = 0;
    }
    accumulator.money[current.type] += current.base_price;
    if (!accumulator.transport[current.type]) {
      accumulator.transport[current.type] = 0;
    }
    accumulator.transport[current.type] += 1;
    if (!accumulator.time[current.type]) {
      accumulator.time[current.type] = 0;
    }
    accumulator.time[current.type] += moment(current.date_to).diff(current.date_from);
    return accumulator;
  }, stats);
  return stats;
};

const renderStats = (pointList) => {
  const BAR_HEIGHT = 55;
  const stats = calculateStats(pointList);
  const {money: moneyStats, transport: transportStats, time: timeStats} = stats;
  moneyCtx.height = BAR_HEIGHT * Object.keys(moneyStats).length;
  transportCtx.height = BAR_HEIGHT * Object.keys(transportStats).length;
  timeCtx.height = BAR_HEIGHT * Object.keys(timeStats).length;
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
  const timeChartCfg = {
    chartTitle: `TIME-SPEND`,
    canvas: timeCtx,
    dataset: timeStats,
    formatter: (value) => `${Math.trunc(moment.duration(value).as(`hours`))}H`
  };
  new Stats(timeChartCfg).render();
};

const renderFilters = () => {
  filterContainer.innerHTML = ``;
  Object.keys(PointFilter).forEach((key) => {
    const filter = new Filter({title: key});
    filter.onClick = () => toggelFilterHandler(PointFilter[key]);
    filterContainer.appendChild(filter.render());
  });
};

const toggelFilterHandler = (filter) => {
  activeFilter = filter;
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderPoints(pointsContainer, sorted);
};

const toggleSortHandler = (evt) => {
  activeSort = PointSort[evt.target.value];
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderPoints(pointsContainer, sorted);
};

const init = () => {
  const originalContainer = activeContainer.cloneNode(true);
  activeContainer.innerHTML = `Loading route...`;
  apiProvider.getDestinations().then((destinations) => depenendencies.register(`destinations`, destinations));
  apiProvider.getOffers().then((offers) => depenendencies.register(`offers`, offers));
  apiProvider.getPoints()
    .then((loadedPoints) => {
      points = loadedPoints;
      replaceElements(activeContainer, originalContainer);
      activeContainer = originalContainer;
      container[`#table`] = originalContainer;
      pointsContainer = originalContainer.querySelector(`.trip-day__items`);
      const sortSwitchers = document.querySelectorAll(`input[name="trip-sorting"]`);
      sortSwitchers.forEach((element) => element.addEventListener(`change`, toggleSortHandler));
      renderStats(points);
      clearContainer(pointsContainer);
      let filtered = filterPoints(points, activeFilter);
      let sorted = sortPoints(filtered, activeSort);
      renderPoints(pointsContainer, sorted);
    })
    .catch((error) => (activeContainer.innerHTML = error.message));
  contentSwitches.forEach((element) => element.addEventListener(`click`, toggleVisibleContent));
  renderFilters();
  document.addEventListener(`offer-accepted`, (evt) => {
    const currency = totalPrice.textContent.substring(0, 1);
    const newTotal = parseFloat(totalPrice.textContent.substring(1)) + evt.detail.price;
    totalPrice.textContent = `${currency} ${newTotal}`;
  });
  document.addEventListener(`offer-rejected`, (evt) => {
    const currency = totalPrice.textContent.substring(0, 1);
    const newTotal = parseFloat(totalPrice.textContent.substring(1)) - evt.detail.price;
    totalPrice.textContent = `${currency} ${newTotal}`;
  });
};

init();
