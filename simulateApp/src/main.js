import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';
import enLang from 'element-ui/lib/locale/lang/en'; // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters

if (process.env.NODE_ENV === 'production') {
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang, // 如果使用中文，无需设置，请删除
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueWamp from 'vue-wamp';
Vue.use(iView);
const WAMP_URL = process.env.VUE_APP_WAMP_URL;
Vue.use(VueWamp, {
  debug: true,
  url: WAMP_URL,
  realm: 'realm1',
  onopen: function(session, details) {
    console.log('WAMP connected', session, details);
  },
  onclose: function(reason, details) {
    console.log('WAMP closed: ' + reason, details);
  },
});
Vue.config.productionTip = false;

// Vue.Wamp.subscribe(
//   'com.myapp.addAvailableDevice',
//   function(args, kwArgs, details) {
//     var tmp = JSON.parse(args[0]);
//     if (tmp && tmp['deviceGroup'] && tmp['isAddNew']) {
//       store.dispatch('user/addAvailableDevice', tmp['deviceGroup']);
//     }
//   },
//   {
//     acknowledge: true, // option needed for promise
//   },
// ).then(function(s) {
//   console.log('AutobahnJS Subscription object: ', s);
// });

// Vue.Wamp.subscribe(
//   'com.myapp.activity',
//   function(args, kwArgs, details) {
//     var tmp = JSON.parse(args[0]);
//     store.dispatch('user/updateActivity');
//   },
//   {
//     acknowledge: true, // option needed for promise
//   },
// ).then(function(s) {
//   console.log('AutobahnJS Subscription object: ', s);
// });

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
