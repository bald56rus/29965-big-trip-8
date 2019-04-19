import Component from "./Component";

class TripPicture extends Component {
  constructor(model) {
    super(model);
  }

  get template() {
    const {src, description} = this._model;
    const element = document.createElement(`template`);
    element.innerHTML = `<img src="${src}" alt="${description}" class="point__destination-image"></img>`;
    return element.content;
  }
}

export default TripPicture;
