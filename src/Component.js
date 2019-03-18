import Components from './Components';

class Component {
  constructor(viewModel) {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this.$viewModel = viewModel;
    this.$components = new Components();
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  renderList(element) {
    const container = element.parentNode;
    container.innerHTML = ``;
    const [component, , property] = element.dataset[`for`].split(` `);
    this.$viewModel[property].forEach((item) => {
      container.appendChild(new this.$components[component](item).render());
    });
  }

  bindEventListener(element) {
    const events = element.dataset.on;
    if (typeof events !== `undefined`) {
      events.split(` `).forEach((evt) => {
        const [eventName, eventHandler] = evt.split(`:`);
        element.addEventListener(eventName, this[eventHandler]);
      });
      delete element.dataset.on;
    }
  }

  _render(pattern, path, node) {
    if (path.length === 0) {
      return;
    }
    const property = path.shift();

    if (!node[property]) {
      return;
    }
    if (path.length === 0) {
      this.$element.innerHTML = this.$element.innerHTML.replace(new RegExp(pattern, `gm`), node[property]);
      return;
    }
    this._render(pattern, path, node[property]);
  }

  render() {
    this.$element = this.template.cloneNode(true);
    this.bindEventListener(this.$element);
    this.$element.innerHTML.match(/{{.*?}}/gm).forEach((pattern) => {
      const path = pattern.replace(/{{(.*)}}/, `$1`).split(`.`);
      this._render(pattern, path, this.$viewModel);
    });
    this.$element.querySelectorAll(`[data-for]`).forEach((list) => {
      this.renderList(list);
    });
    this.$element.querySelectorAll(`[data-on]`).forEach((element) => {
      this.bindEventListener(element);
    })
    ;
    return this.$element;
  }

}

export default Component;
