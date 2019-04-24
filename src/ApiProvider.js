import {cloneDeep} from 'lodash';
import Dependencies from "./DependenciesContainer";
const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

class ApiProvider {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = new Headers(options.headers);
    this._dependencies = new Dependencies();
    this._icons = this._dependencies[`icons`];
  }

  convertToClient(model) {
    const mappedModel = cloneDeep(model);
    const {date_from: dateFrom, date_to: dateTo, base_price: price} = mappedModel;
    mappedModel.dateFrom = new Date(dateFrom);
    mappedModel.dateTo = new Date(dateTo);
    mappedModel.price = price;
    mappedModel.icon = this._icons[mappedModel.type];
    delete mappedModel[`date_from`];
    delete mappedModel[`date_to`];
    delete mappedModel[`base_price`];
    return mappedModel;
  }
  static convertToServer(model) {
    const mappedModel = cloneDeep(model);
    const {dateFrom, dateTo, price} = mappedModel;
    mappedModel[`date_from`] = dateFrom.getTime();
    mappedModel[`date_to`] = dateTo.getTime();
    mappedModel[`base_price`] = price;
    delete mappedModel.dateFrom;
    delete mappedModel.dateTo;
    delete mappedModel.price;
    return mappedModel;
  }
  deletePoint(pointId) {
    const url = `points/${pointId}`;
    return this._request(url, RequestMethod.DELETE);
  }
  getDestinations() {
    return this._request(`destinations`, RequestMethod.GET)
      .then((response) => {
        return response.json();
      });
  }
  getOffers() {
    return this._request(`offers`, RequestMethod.GET)
      .then((response) => {
        return response.json();
      });
  }
  getPoints() {
    return this._request(`points`, RequestMethod.GET)
      .then((response) => (response.json()))
      .then((points) => (points.map((point) => this.convertToClient(point))))
      .catch(() => {
        const error = new Error(`Something went wrong while loading your route info. Check your connection or try again later`);
        return Promise.reject(error);
      });
  }
  savePoint(model) {
    let url = `points`;
    if (model.id) {
      url += `/${model.id}`;
    }
    return this._request(url, model.id ? RequestMethod.PUT : RequestMethod.POST, ApiProvider.convertToServer(model))
      .then((response) => (response.json()))
      .then((point) => (this.convertToClient(point)));
  }
  _request(endpoint, method, model) {
    const options = {
      method,
      headers: this._headers
    };
    if (model) {
      options.body = JSON.stringify(model);
    }
    return fetch(`${this._baseUrl}/${endpoint}`, options)
      .then((response) => {
        if (response.ok) {
          return Promise.resolve(response);
        }
        return Promise.reject(response);
      });
  }

}

export default ApiProvider;
