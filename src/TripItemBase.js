class TripItemBase {
  constructor(tripItem) {
    if (new.target === TripItemBase) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._tripItem = tripItem;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  $replacePatternString(pattern, content) {
    return this.$element.innerHTML.replace(pattern, content);
  }

  renderCustomElements() { }

  bindEventListeners() { }

  render() {
    this.$element = this.template.cloneNode(true);
    this.$element.innerHTML = this.$replacePatternString(`$icon`, this._tripItem.icon);
    this.$element.innerHTML = this.$replacePatternString(`$title`, this._tripItem.title);
    this.$element.innerHTML = this.$replacePatternString(`$description`, this._tripItem.description);
    this.$element.innerHTML = this.$replacePatternString(`$currency`, this._tripItem.price.currency);
    this.$element.innerHTML = this.$replacePatternString(`$price`, this._tripItem.price.value);
    const timetableStart = `${this._tripItem.timetable.start.getHours()}:${this._tripItem.timetable.start.getMinutes().toString().padStart(2, `0`)}`;
    const timetableStop = `${this._tripItem.timetable.stop.getHours()}:${this._tripItem.timetable.stop.getMinutes().toString().padStart(2, `0`)}`;
    this.$element.innerHTML = this.$replacePatternString(`$timetable_start`, timetableStart);
    this.$element.innerHTML = this.$replacePatternString(`$timetable_stop`, timetableStop);
    this.$element.innerHTML = this.$replacePatternString(`$timetable_duration`, `${Math.trunc(this._tripItem.duration / 60)}h ${this._tripItem.duration % 60}m`);
    this.renderCustomElements();
    this.bindEventListeners();
    return this.$element;
  }

}

export default TripItemBase;
