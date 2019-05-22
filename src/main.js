import Vue from 'vue';
import './main.styl';
import Vuetify from 'vuetify';

import App from './App';
import router from '@/router';
import store from '@/store';

import api from '@/api';
import './eventBus';


import '@/assets/disciplines/style.css'


import colors from 'vuetify/es5/util/colors';
Vue.use(Vuetify, {
  theme: {
    primary: '#0288d1',
    secondary: "#546e7a",
    accent: '#ffffff', // #3F51B5
    demko: '#0288d1'
  }
});

import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "<API_KEY>",
    libraries: 'places'
  }
});


import pl from './locale/pl';
import en from './locale/en';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'pl',
  messages: {pl, en}
})

Vue.filter('translate', function (value) {
  if (!value) return ''
  value = value.toString()
  return i18n.t(value);
})

Vue.mixin({
  methods:{
    reset(obj, value=null){
      Object.keys(obj).forEach(key => {
        if(obj[key] !== null && typeof obj[key] === 'object') this.reset(obj[key], value);
        else obj[key] = value;
      })
    }
  }
})

Vue.mixin({
  data: function() {
    return {
      get apiUrl() {
        return api.API_URL;
      }
    }
  }
})



Vue.config.productionTip = IS_DEV;
Vue.config.debug = IS_DEV;
Vue.config.devtools = IS_DEV;

Vue.http = Vue.prototype.$http = api;
api.init();


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
