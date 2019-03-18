class Offer {
  constructor(offer) {
    this._offer = offer;
  }

  get template() {
    const template =
    `<input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
    <label for="add-luggage" class="point__offers-label">
      <span class="point__offer-service">{{title}}</span> + {{currency}}
      <span class="point__offer-price">{{price}}</span>
    </label>`;
    return template;
  }

  render() {
    const id = this._offer.title.split(` `).map((word) => word.toLowerCase()).join(`-`);
    const container = document.createElement(`template`);
    container.innerHTML = this.template;
    Object.keys(this._offer).forEach((key) =>{
      const pattern = new RegExp(`{{${key}}}`, `gm`);
      container.innerHTML = container.innerHTML.replace(pattern, this._offer[key]);
    });
    const input = container.content.querySelector(`input`);
    input.id = id;
    input.value = id;
    const label = container.content.querySelector(`label`);
    label.htmlFor = id;
    return container.content;
  }
}

export default Offer;
