import axios from 'axios';
import {URL_API} from './urlapi';

class Api {

  static get(route, token, cancelToken) {
    if( token ) {
      return axios.get(`${URL_API}${route}`,
        {
          headers: { 'x-access-token': token },
          cancelToken
        }
      );
    }
    return axios.get(`${URL_API}${route}`);
  }

  static put(route, params, token) {
    if( token ) {
      return axios.put(`${URL_API}${route}`, params,
        {
          headers: { 'x-access-token': token }
        }
      );
    }
    return axios.put(`${URL_API}${route}`, params);
  }

  static post(route, params, token, extraHeaders) {
    if( token ) {
      return axios.post(`${URL_API}${route}`, params,
        {
          headers: {
            'x-access-token': token,
            ...extraHeaders
          }
        }
      );
    }
    return axios.post(`${URL_API}${route}`, params);
  }

  static delete(route, params, token) {
    if( token ) {
      // use axios contructor to delete because there's a bug where the token is not passed
      return axios({
        method: 'delete',
        url: `${URL_API}${route}`,
        data: params,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
    }
    return axios.delete(`${URL_API}${route}`, params);
  }
}

export default Api;
