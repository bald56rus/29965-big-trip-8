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
      this.$markupInstance = this.$markupInstance.replace(new RegExp(pattern, `gm`), node[property]);
      return;
    }
    this._render(pattern, path, node[property]);
  }

  render() {
    this.$markupInstance = this.template;
    this.$markupInstance.match(/{{.*?}}/gm).forEach((pattern) => {
      const path = pattern.replace(/{{(.*)}}/, `$1`).split(`.`);
      this._render(pattern, path, this.$viewModel);
    });
    const wrapper = document.createElement(`template`);
    wrapper.innerHTML = this.$markupInstance;
    this.$elementInstance = wrapper.content.querySelector(`*`);
    this.$elementInstance.querySelectorAll(`[data-for]`).forEach((list) => {
      this.renderList(list);
    });
    this.bindEventListener(this.$elementInstance);
    this.$elementInstance.querySelectorAll(`[data-on]`).forEach((element) => {
      this.bindEventListener(element);
    })
    ;
    return this.$elementInstance;
  }

}

export default Component;
