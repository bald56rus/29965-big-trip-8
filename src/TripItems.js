import {getRandom, shuffleArray} from './Utils.js';

const tripTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`,
  `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const tripDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const tripOffers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];

const TripItemIconMap = {
  "Taxi": `🚕`,
  "Bus": `🚌`,
  "Train": `🚂`,
  "Ship": `🛳️`,
  "Transport": `🚊`,
  "Drive": `🚗`,
  "Flight": `✈️`,
  "Check-in": `🏨`,
  "Sightseeing": `🏛️`,
  "Restaurant": `🍴`,
};

const generateTripItem = (timetableStart) => {
  let tripItem = {};
  let type = `${shuffleArray(tripTypes)[0]}`;
  tripItem.icon = TripItemIconMap[type];
  tripItem.title = type;
  tripItem.description = shuffleArray(tripDescriptions).slice(0, getRandom(1, 3)).join(` `);
  let duration = getRandom(61, 120);
  const timetableStop = new Date(timetableStart);
  timetableStop.setMinutes(timetableStop.getMinutes() + duration);
  tripItem.timetable = {
    start: new Date(timetableStart),
    stop: new Date(timetableStop),
  };

  tripItem.price = getRandom(10, 100);
  let offers = shuffleArray(tripOffers)
    .slice(0, getRandom(0, 2))
    .map((offer) => {
      return {title: offer, price: `${getRandom(10, 100)}`};
    });
  tripItem.offers = offers;
  tripItem.photos = [];
  const photoCount = getRandom(1, 5);
  for (let i = 0; i < photoCount; i++) {
    tripItem.photos.push({src: `http://picsum.photos/330/140?r=${getRandom(1, 1000)}`});
  }
  return tripItem;
};

const generateTripItems = () => {
  const tripItems = [];
  const itemsCount = getRandom(1, 3);
  let now = new Date();
  let timetableStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  timetableStart.setMinutes(600);
  for (let i = 0; i < itemsCount; i++) {
    let item = generateTripItem(timetableStart);
    timetableStart = item.timetable.stop;
    tripItems.push(item);
  }
  return tripItems;
};

export default generateTripItems;
