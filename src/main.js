import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import { store } from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Menu from '@/components/Menu'
import Workspace from '@/components/Workspace'

Vue.component('Menu', Menu)
Vue.component('Workspace', Workspace)

// Font awesome icons
import { faCannabis } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faHiking } from '@fortawesome/free-solid-svg-icons'
library.add(faCannabis)
library.add(faBars)
library.add(faSignOutAlt)
library.add(faHiking)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
		app = new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount('#app');
	}
});

export const db = firebase.firestore()
export const auth = firebase.auth()
