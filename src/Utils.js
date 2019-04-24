
function getProperty(model, path) {
  if (path.length === 0) {
    return undefined;
  }
  const [propertyName, ...rest] = path;
  const property = model[propertyName];
  if (!property) {
    return undefined;
  }
  if (rest.length === 0) {
    return property;
  }
  return getProperty(property, rest);
}

function _render(template, patterns, model) {
  if (patterns.length === 0) {
    return template;
  }
  const [pattern, ...tail] = patterns;
  const property = getProperty(model, pattern.substring(2, pattern.length - 2).split(`.`)) || ``;
  template = template.replace(new RegExp(pattern, `gm`), property);
  return _render(template, tail, model);
}

const render = (template, model) => _render(template, [...new Set(template.match(/{{.*?}}/gm))], model);

export {
  render
};
