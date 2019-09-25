const ambulate_config = require('../config.json')
import Vue from 'vue'
import aws from 'aws-sdk'
import App from './App.vue'
import router from './router'
import { store } from './store'
import mixin from './mixin.js'
//import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/fontawesome.css'
import '../public/css/main.css'

import ClickConfirm from 'click-confirm/dist/click-confirm.min.js'
Vue.component('clickConfirm', ClickConfirm)

import XRegExp from 'xregexp'
Object.defineProperty(Vue.prototype, '$XRegExp', { value: XRegExp });

Vue.config.productionTip = false

let app = '';

firebase.initializeApp(ambulate_config.firebase)

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
})

export const s3_bucket = ambulate_config.digitaloceans_spaces.bucket
export const s3 = new aws.S3({
	endpoint: ambulate_config.digitaloceans_spaces.endPoint,
	accessKeyId: ambulate_config.digitaloceans_spaces.accessKeyId,
	secretAccessKey: ambulate_config.digitaloceans_spaces.secretAccessKey
})
export const auth = firebase.auth()
