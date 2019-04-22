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

  getPoints() {
    return this._http(`points`, RequestMethod.GET)
      .then((response) => (response.json()))
      .then((points) => (points.map((point) => this.mapToDTO(point))))
      .catch(() => {
        const error = new Error(`Something went wrong while loading your route info. Check your connection or try again later`);
        return Promise.reject(error);
      });
  }
  mapToDTO(model) {
    const mappedModel = cloneDeep(model);
    const {date_from: dateFrom, date_to: dateTo, base_price: price} = mappedModel;
    mappedModel.dateFrom = new Date(dateFrom);
    mappedModel.dateTo = new Date(dateTo);
    mappedModel.price = price;
    mappedModel.icon = this._icons[mappedModel.type];
    return mappedModel;
  }
  mapToDAO(model) {
    const mappedModel = cloneDeep(model);
    const {dateFrom, dateTo, price} = mappedModel;
    mappedModel[`date_from`] = dateFrom.getTime();
    mappedModel[`date_to`] = dateTo.getTime();
    mappedModel[`base_price`] = price;
    return mappedModel;
  }
  getDestinations() {
    return this._http(`destinations`, RequestMethod.GET)
      .then((response) => {
        return response.json();
      });
  }
  getOffers() {
    return this._http(`offers`, RequestMethod.GET)
      .then((response) => {
        return response.json();
      });
  }
  createPoint(model) {
    const url = `points`;
    return this._http(url, RequestMethod.POST, this.mapToDAO(model));
  }
  savePoint(model) {
    const url = `points/${model.id}`;
    return this._http(url, RequestMethod.PUT, this.mapToDAO(model));
  }
  deletePoint(pointId) {
    const url = `points/${pointId}`;
    return this._http(url, RequestMethod.DELETE);
  }
  _http(endpoint, method, model) {
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
