import axios from 'axios'
import errorHandler from './errorHanlder';

const API_URL = 'http://18.130.184.78:5000/';


export default {
  API_URL,

  init () {
    axios.defaults.baseURL = API_URL;
    axios.interceptors.response.use(res => res, errorHandler);
    this.setHeader();
  },

  setHeader () {
    //axios.defaults.headers.common['Authorization'] = `Bearer ${jwtService.getToken()}`;
  },

  removeHeader(){
    delete axios.defaults.headers.common['Authorization'];
  },

  
  get () {
    return axios.get(...arguments)
  },

  post () {
    return axios.post(...arguments)
  },

  update () {
    return axios.put(...arguments)
  },

  put () {
    return axios.put(...arguments)
  },

  delete () {
    return axios.delete(...arguments)
  }

  
};