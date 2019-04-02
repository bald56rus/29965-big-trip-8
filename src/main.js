import Filter from './Filter';
import TripItem from './TripItem';
import TripItemForm from './TripItemForm';
import Stats from './Stats';
import ApiProvider from './ApiProvider';
import DependenciesContainer from './DependenciesContainer';

const PointFilter = {
  'Everything': () => true,
  'Future': (point) => point.date_from > new Date(),
  'Past': (point) => point.date_to <= new Date()
};
const container = {
  '#table': document.getElementById(`table`),
  '#stats': document.getElementById(`stats`)
};
let activeContainer = container[`#table`];

const filterContainer = document.querySelector(`.trip-filter`);
const contentSwitches = document.querySelectorAll(`.view-switch__item`);
let pointsContainer = null;
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const TypeIconMap = {
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
depenendencies.register(`type-icon-map`, TypeIconMap);
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

const removePoint = (savedPoints, {id}) => {
  return savedPoints.filter((point) => point.id !== id);
};

const savePointHandler = (original, model) => {
  points = removePoint(points, model);
  points.push(model);
  const replacement = new TripItem(model);
  replacement.onClick = clickPointHandler;
  replaceElements(original, replacement.render());
};

const deletePointHandler = (element, model) => {
  points = removePoint(points, model);
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
  const key = `${current.type}`;
  let property = accumulator[key];
  if (property) {
    property.totalPrice += current.base_price;
    property.totalCount += 1;
  } else {
    accumulator[key] = {totalPrice: current.base_price, totalCount: 1};
  }
  return accumulator;
};

const renderStats = (pointList) => {
  const BAR_HEIGHT = 55;
  const transports = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`].map((x) => x.toLowerCase());
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
      pointsContainer = originalContainer.querySelector(`.trip-day__items`);
      renderStats(points);
      renderPoints(points);
    })
    .catch((error) => (activeContainer.innerHTML = error.message));
  contentSwitches.forEach((element) => element.addEventListener(`click`, toggleVisibleContent));
  renderFilters();

};

init();
