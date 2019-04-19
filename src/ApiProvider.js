import {cloneDeep} from 'lodash';
import Dependencies from "./DependenciesContainer";
import moment from 'moment';
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
      .then((points) => (points.map((point) => this._fromServer(point))))
      .catch(() => {
        const error = new Error(`Something went wrong while loading your route info. Check your connection or try again later`);
        return Promise.reject(error);
      })
      .then((points) => {
        const grouped = points.reduce((accumulator, point) => {
          const tripDay = moment(new Date(point[`date_from`])).format(`DD MMM`);
          if (!accumulator[tripDay]) {
            accumulator[tripDay] = [];
          }
          accumulator[tripDay].push(point);
          return accumulator;
        }, {});
        return points;
      });
  }
  _fromServer(model) {
    const mappedModel = cloneDeep(model);
    mappedModel.icon = this._icons[mappedModel.type];
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
  savePoint(model) {
    const url = `points/${model.id}`;
    return this._http(url, RequestMethod.PUT, model);
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
    if (!model) {
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
