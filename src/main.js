import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import { store } from './store'
import mixin from './mixin.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/main.css'
import XRegExp from 'xregexp'
Object.defineProperty(Vue.prototype, '$XRegExp', { value: XRegExp });

// Font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCannabis } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faHiking } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)
library.add(faChevronLeft)
library.add(faMapMarkedAlt)
library.add(faInfoCircle)
library.add(faCalendar)
library.add(faTimes)
library.add(faExclamationTriangle)
library.add(faSave)
library.add(faTrashAlt)
library.add(faCannabis)
library.add(faBars)
library.add(faSignOutAlt)
library.add(faHiking)
Vue.component('font-awesome-icon', FontAwesomeIcon)


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
