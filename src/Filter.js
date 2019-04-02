import Component from "./Component";
import {render} from "./Utils";

class Filter extends Component {
  constructor(model) {
    super(model);
    const {id} = this._model;
    if (id === undefined) {
      Object.defineProperty(this._model, `id`, {
        get() {
          return `filter-${model.title.toLowerCase()}`;
        }
      });
    }
    this._clickHandler = this._clickHandler.bind(this);
  }

  get template() {
    const markup =
      `<input type="radio" id="{{id}}" name="filter" value="{{title}}">
      <label class="trip-filter__item" for="{{id}}">{{title}}</label>`;
    const template = document.createElement(`template`);
    template.innerHTML = render(markup, this._model);
    return template.content;
  }

  set onClick(handler) {
    this._onClick = handler;
  }

  _clickHandler() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  bind() {
    this._element.querySelector(`label`).addEventListener(`click`, this._clickHandler);
  }

}

export default Filter;
