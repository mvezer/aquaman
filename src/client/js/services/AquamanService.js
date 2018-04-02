import isomorphicFetch from 'isomorphic-fetch'; // eslint-disable-line no-unused-vars
import path from 'path';

class AquamanService {
  constructor() {
    this.apiUrlPrefix = '/api/';
    this.contentTypeHeaders = {
      accept: 'application/json',
      'content-type': 'application/json',
    };
    this.feeding = this.feeding.bind(this);
    this.maintenance = this.maintenance.bind(this);
    this.fetchJSON = this.fetchJSON.bind(this);
  }

  feeding() {
    return this.fetchJSON('PUT', path.join(this.apiUrlPrefix, 'feeding'));
  }

  maintenance() {
    return this.fetchJSON('PUT', path.join(this.apiUrlPrefix, 'maintenance'));
  }

  getStatus() {
    return this.fetchJSON('GET', path.join(this.apiUrlPrefix, 'status'));
  }

  fetchJSON(method, endpoint, body = {}, requestHeaders = {}) {
    const headers = Object.assign({}, this.contentTypeHeaders, requestHeaders);
    const options = {
      method,
      credentials: 'include',
      headers,
    };
    if (method === 'PUT' || method === 'POST') {
      options.body = JSON.stringify(body);
    }

    return fetch(endpoint, options) // eslint-disable-line no-undef
      .then((response) => {
        if (response.status >= 400) {
          const errorResponse = new Error('Bad response from server');
          errorResponse.message = response.statusText;
          errorResponse.status = response.status;
          errorResponse.url = endpoint;
          errorResponse.requestBody = body;
          throw errorResponse;
        }

        return response.json();
      })
      .catch((error) => {
        const errorResponse = new Error('Request failed');
        errorResponse.message = error.message;
        errorResponse.status = 500;
        errorResponse.url = endpoint;
        errorResponse.requestBody = body;
        throw errorResponse;
      });
  }
}

export default AquamanService;
