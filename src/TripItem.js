import Component from "./Component";

class TripItem extends Component {
  constructor(viewModel) {
    super(viewModel);
    this.clickHandler = this.clickHandler.bind(this);
  }

  get template() {
    return document.querySelector(`#trip`).content.querySelector(`.trip-point`);
  }

  clickHandler() {
    const clickEvent = new CustomEvent(`point-click`, {
      'detail': {
        element: this.$element, model: this.$viewModel
      }
    });
    this.$element.dispatchEvent(clickEvent);
  }
}

export default TripItem;
