class Offer {
  constructor(offer) {
    this._offer = offer;
  }

  get template() {
    let template = document.createElement(`template`);
    template.innerHTML = `<li><button class="trip-point__offer">Order UBER +&euro;&nbsp;20</button></li>`;
    return template.content.firstChild;
  }

  render() {
    const element = this.template.cloneNode(true);
    element.querySelector(`button`).innerHTML = `${this._offer.title} +${this._offer.currency}&nbsp;${this._offer.price}`;
    return element;
  }
}

export default Offer;
