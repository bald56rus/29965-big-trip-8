import Component from "./Component";

class Offer extends Component {
  constructor(offer) {
    super(offer);
  }

  get template() {
    return `<li><button class="trip-point__offer">{{title}} +{{currency}}&nbsp;{{price}}</button></li>`;
  }
}

export default Offer;
