import axios from 'axios';
import { Config } from './config.helper';

// axios instance
const http = axios.create();

// set base url
http.defaults.baseURL = Config.apiURL;

// set headers
http.defaults.headers.common['Content-Type'] = 'application/json';

// set timeout to 1 min
http.defaults.timeout = 60000; 

// set interceptors (after request)
http.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  },
);

// set interceptors (before response)
http.interceptors.response.use(
  (response) => {
    // do something with response data
    return response;
  },
  (error) => {
    // do something with response error
    return Promise.reject(error);
  },
);

// export http instance
export default http;
