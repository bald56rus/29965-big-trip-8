import Component from "./Component";

class TripItemForm extends Component {
  constructor(viewModel) {
    super(viewModel);
    this.submitHandler = this.submitHandler.bind(this);
  }

  get template() {
    return document.querySelector(`#trip-item-form`).content.querySelector(`.point`).outerHTML;
  }

  submitHandler(evt) {
    evt.preventDefault();
    const submitEvent = new CustomEvent(`point-save`, {
      'detail': {
        element: this.$elementInstance, model: this.$viewModel
      }
    });
    this.$elementInstance.dispatchEvent(submitEvent);
  }
}

export default TripItemForm;
