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

}

export default DependenciesContainer;
