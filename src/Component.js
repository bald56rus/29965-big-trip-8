class Component {
  constructor(model) {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._model = model;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  bind() { }

  render() {
    this._element = this.template;
    this.bind();
    return this._element;
  }
}

export default Component;
