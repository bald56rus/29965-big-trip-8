let instance = null;

class DependenciesContainer {
  constructor() {
    if (instance !== null) {
      return instance;
    }
    instance = this;
  }

  register(key, value) {
    this[key] = value;
  }

  resolve(key) {
    return this[key];
  }

}

export default DependenciesContainer;
