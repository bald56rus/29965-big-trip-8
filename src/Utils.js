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

function replacePatternString(template, patternString, model, path) {
  if (path.length === 0) {
    return template;
  }
  const propertyName = path.shift();
  const property = model[propertyName];
  if (!property) {
    return template;
  }
  if (path.length === 0) {
    template = template.replace(new RegExp(patternString, `gm`), property);
    return template;
  }
  return replacePatternString(template, patternString, property, path);
}

const renderTemplate = (template, model) => {
  template.match(/{{.*?}}/gm).forEach((patternString) => {
    const path = patternString.replace(/{{(.*)}}/, `$1`).split(`.`);
    template = replacePatternString(template, patternString, model, path);
    replacePatternString(template, patternString, model, path);
  });
  return template;
};

export {
  getRandom,
  shuffleArray,
  renderTemplate
};
