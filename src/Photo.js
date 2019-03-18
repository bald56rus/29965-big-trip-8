class Photo {
  constructor(photo) {
    this._photo = photo;
  }

  get template() {
    const template = document.createElement(`template`);
    template.innerHTML = `<img src="" alt="picture from place" class="point__destination-image">`;
    return template.content.firstChild;
  }

  render() {
    const element = this.template.cloneNode(true);
    element.src = this._photo.src;
    return element;
  }
}

export default Photo;
