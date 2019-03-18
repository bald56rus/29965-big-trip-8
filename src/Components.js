let instance = null;

class Components {
  constructor() {
    if (instance !== null) {
      return instance;
    }
    instance = this;
  }
  register(name, component) {
    instance[name] = component;
  }
}

export default Components;
