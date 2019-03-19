import Component from "./Component";

class Photo extends Component {
  constructor(photo) {
    super(photo);
  }

  get template() {
    return `<img src="{{src}}" alt="picture from place" class="point__destination-image">`;
  }
}

export default Photo;
