import Dependencies from "./DependenciesContainer";
const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
}

class ApiProvider {
  constructor(options) {
    this._prefixUrl = options.prefixUrl;
    this._headers = new Headers(options.headers);
    this._dependencies = new Dependencies();
  }


  getPoints() {
    const url = `${this._prefixUrl}/points`;
    return this._http(`points`, RequestMethod.GET).then((response) => {
      return response.json();
    })
      .then((points) => {
        return points.map((point) => {
          const p = { ...point };
          p.icon = this._dependencies[`type-icon-map`][`Taxi`];
          return p;
        });
      });
  }

  getDestinations() {
    return this._http(`destinations`, RequestMethod.GET).then((response) => {
      return response.json();
    });
  }
  getOffers() {
    return this._http(`offers`, RequestMethod.GET).then((response) => {
      return response.json();
    });
  }

  _http(endpoint, method) {
    const options = {
      method: method,
      headers: this._headers
    }
    return fetch(`${this._prefixUrl}/${endpoint}`, options);
  }

}

export default ApiProvider;
