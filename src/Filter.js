import Component from "./Component";
import {renderTemplate} from "./Utils";

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
    this.clickHandler = this.clickHandler.bind(this);
  }

  get template() {
    const markup =
      `<input type="radio" id="{{id}}" name="filter" value="{{title}}">
      <label class="trip-filter__item" for="{{id}}">{{title}}</label>`;
    const template = document.createElement(`template`);
    template.innerHTML = renderTemplate(markup, this._model);
    return template.content;
  }

  clickHandler() { }

}

export default Filter;
