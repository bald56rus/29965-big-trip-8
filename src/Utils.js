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

function getProperty(model, path) {
  if (path.length === 0) {
    return undefined;
  }
  const [propertyName, ...sub] = path;
  const property = model[propertyName];
  if (!property) {
    return undefined;
  }
  if (sub.length === 0) {
    return property;
  }
  return getProperty(property, sub);
}

function _render(template, patterns, model) {
  if (patterns.length === 0) {
    return template;
  }
  const [pattern, ...tail] = patterns;
  const property = getProperty(model, pattern.substring(2, pattern.length - 2).split(`.`));
  if (!property) {
    return _render(template, tail, model);
  }
  template = template.replace(new RegExp(pattern, `gm`), property);
  return _render(template, tail, model);
}

const render = (template, model) => _render(template, [...new Set(template.match(/{{.*?}}/gm))], model);

export {
  getRandom,
  shuffleArray,
  render
};
