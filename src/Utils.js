const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (source) => {
  for (let i = 0; i < source.length; i++) {
    let j = getRandom(0, source.length - 1);
    let swap = source[i];
    source[i] = source[j];
    source[j] = swap;
  }
  return source;
};

export {
  getRandom,
  shuffleArray
};
