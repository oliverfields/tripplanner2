import Vue from 'vue'
import firebase from 'firebase';
import App from './App.vue'
import router from './router'
import { store } from './store'

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
