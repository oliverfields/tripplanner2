import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import { store } from './store'
import mixin from './mixin.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/fontawesome.css'
import '../public/css/main.css'
import XRegExp from 'xregexp'
Object.defineProperty(Vue.prototype, '$XRegExp', { value: XRegExp });

// Leaflet
import 'leaflet/dist/leaflet.css'
// fix icon for marker
import { Icon } from 'leaflet'
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})



Vue.config.productionTip = false

let app = '';

firebase.initializeApp({
  apiKey: "AIzaSyB9UegF_cFN1NWlOVkUB1m7Ra70niwn_Jc",
  authDomain: "vue-firebase-tutorial-3513b.firebaseapp.com",
  databaseURL: "https://vue-firebase-tutorial-3513b.firebaseio.com",
  projectId: "vue-firebase-tutorial-3513b",
  storageBucket: "",
  messagingSenderId: "485476877358",
  appId: "1:485476877358:web:0c71745d612455bb"
});

firebase.auth().onAuthStateChanged(() => {
	if(!app) {
		Vue.mixin(mixin)
		app = new Vue({
			router,
			store,
			XRegExp,
			render: h => h(App)
		}).$mount('#app');
	}
});

export const db = firebase.firestore()
export const auth = firebase.auth()
