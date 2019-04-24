import Filter from './Filter';
import TripPoint from './TripPoint';
import EditTripPoint from './EditTripPoint';
import Stats from './Stats';
import ApiProvider from './ApiProvider';
import DependenciesContainer from './DependenciesContainer';
import moment from 'moment';
import TripDay from './TripDay';

const BarHeight = 55;

const PointFilter = {
  'everything': () => true,
  'future': (point) => point.dateFrom > new Date(),
  'past': (point) => point.dateTo <= new Date()
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
  time: sortBy(`dateFrom`),
  price: sortBy(`price`)
};

let activeFilter = PointFilter[document.querySelector(`[name="filter"]:checked`).value];
let activeSort = PointSort[document.querySelector(`[name="trip-sorting"]:checked`).value];
let activePoint = null;

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
const dependenciesContainer = new DependenciesContainer();
dependenciesContainer.register(`icons`, Icons);
let points = [];
const apiProvider = new ApiProvider({
  baseUrl: `https://es8-demo-srv.appspot.com/big-trip`,
  headers: {
    'Accept': `application/json`,
    'Content-Type': `application/json`,
    'Authorization': `Basic eo0w590ik29889i`
  }
});
dependenciesContainer.register(`apiProvider`, apiProvider);

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
  original = null;
};

const removePoint = (savedPoints, pointId) => {
  return savedPoints.filter((point) => point.id !== pointId);
};

const addPointHandler = () => {
  closeOpenedPoint();
  const now = new Date();
  const point = {
    type: ``,
    dateFrom: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    dateTo: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    offers: [],
    destination: {
      pictures: []
    }
  };
  const newPoint = new EditTripPoint(point);
  newPoint.onSave = createPointHandler;
  newPoint.onCancel = cancelCreateHandler;
  newPoint.onDelete = cancelCreateHandler;
  pointsContainer.insertBefore(newPoint.render(), pointsContainer.firstChild);
};

document.querySelector(`.new-event`).addEventListener(`click`, addPointHandler);

const closeOpenedPoint = () => {
  if (activePoint !== null) {
    const tripPoint = new TripPoint(activePoint.model);
    tripPoint.onClick = clickPointHandler;
    replaceElements(activePoint.element, tripPoint.render());
    activePoint = null;
  }
};

const clickPointHandler = (original, model) => {
  closeOpenedPoint();
  const tripPoint = new EditTripPoint(model);
  tripPoint.onCancel = closeOpenedPoint;
  tripPoint.onSave = savePointHandler;
  tripPoint.onDelete = deletePointHandler;
  const replacement = tripPoint.render();
  replaceElements(original, replacement);
  activePoint = {element: replacement, model};
};

const cancelCreateHandler = (original) => {
  original.parentNode.removeChild(original);
};

const deletePointHandler = (pointId) => {
  points = removePoint(points, pointId);
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderTotalPrice(calculateTotalPrice(sorted));
  renderPoints(pointsContainer, sorted);
};

const createPointHandler = (model) => {
  points.push(model);
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderTotalPrice(calculateTotalPrice(sorted));
  renderPoints(pointsContainer, sorted);
};

const savePointHandler = (model) => {
  points = removePoint(points, model.id);
  points.push(model);
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderTotalPrice(calculateTotalPrice(points));
  renderPoints(pointsContainer, sorted);
};

const clearContainer = (targetContainer) => {
  targetContainer.innerHTML = ``;
};

const renderTotalPrice = (price) => {
  const currency = totalPrice.textContent.substring(0, 1);
  totalPrice.innerHTML = `${currency}&nbsp;${price}`;
};

const renderPoints = (targetContainer, pointList) => {
  const days = pointList
    .reduce((accumulator, point) => {
      const tripDay = moment(point.dateFrom).format(`MMM DD`);
      if (!accumulator[tripDay]) {
        accumulator[tripDay] = [];
      }
      accumulator[tripDay].push(point);
      return accumulator;
    }, {});
  let tripDays = new DocumentFragment();
  Object.keys(days).forEach((day, index) => {
    const tripDay = new TripDay({day, index: index + 1}).render();
    const tripPoints = tripDay.querySelector(`.trip-day__items`);
    days[day].sort(activeSort).forEach((point) => {
      const tripPoint = new TripPoint(point);
      tripPoint.onClick = clickPointHandler;
      tripPoints.appendChild(tripPoint.render());
    });
    tripDays.appendChild(tripDay);
  });
  targetContainer.appendChild(tripDays);
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
    accumulator.price += current.price;
    if (!accumulator.money[current.type]) {
      accumulator.money[current.type] = 0;
    }
    accumulator.money[current.type] += current.price;
    if (!accumulator.transport[current.type]) {
      accumulator.transport[current.type] = 0;
    }
    accumulator.transport[current.type] += 1;
    if (!accumulator.time[current.type]) {
      accumulator.time[current.type] = 0;
    }
    accumulator.time[current.type] += moment(current.dateTo).diff(current.dateFrom);
    return accumulator;
  }, stats);
  return stats;
};

const calculateTotalPrice = (pointList) => {
  return pointList.reduce((total, point) => {
    total += point.price;
    let acceptedOffers = point.offers.filter((offer) => offer.accepted === true);
    if (acceptedOffers.length > 0) {
      total += acceptedOffers.reduce((offerPrice, offer) => (offerPrice += offer.price), 0);
    }
    return total;
  }, 0);
};

const renderStats = (pointList) => {
  const stats = calculateStats(pointList);
  const {money: moneyStats, transport: transportStats, time: timeStats} = stats;
  moneyCtx.height = BarHeight * Object.keys(moneyStats).length;
  transportCtx.height = BarHeight * Object.keys(transportStats).length;
  timeCtx.height = BarHeight * Object.keys(timeStats).length;
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
    filter.onClick = () => toggleFilterHandler(PointFilter[key]);
    filterContainer.appendChild(filter.render());
  });
};

const toggleFilterHandler = (filter) => {
  activeFilter = filter;
  clearContainer(pointsContainer);
  let filtered = filterPoints(points, activeFilter);
  let sorted = sortPoints(filtered, activeSort);
  renderTotalPrice(calculateTotalPrice(sorted));
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
  dependenciesContainer.register(`destinations`, apiProvider.getDestinations());
  dependenciesContainer.register(`offers`, apiProvider.getOffers());
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
      pointsContainer = document.querySelector(`.trip-points`);
      pointsContainer.innerHTML = ``;
      renderPoints(pointsContainer, sorted);
      renderTotalPrice(calculateTotalPrice(points));
    })
    .catch((error) => (activeContainer.innerHTML = error.message));
  contentSwitches.forEach((element) => element.addEventListener(`click`, toggleVisibleContent));
  renderFilters();
};

init();
