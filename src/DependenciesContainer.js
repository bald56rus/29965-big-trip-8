let instance = null;

class Dependencies {
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

export default Dependencies;
