import Vue from 'vue'
import aws from 'aws-sdk'
import App from './App.vue'
import router from './router'
import { store } from './store'
import mixin from './mixin.js'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/fontawesome.css'
import '../public/css/main.css'

import ClickConfirm from 'click-confirm/dist/click-confirm.min.js'
Vue.component('clickConfirm', ClickConfirm)

import XRegExp from 'xregexp'
Object.defineProperty(Vue.prototype, '$XRegExp', { value: XRegExp })

Vue.config.productionTip = process.env.VUE_APP_PRODUCTIONTIP

let app = ''

firebase.initializeApp({
	"apiKey": process.env.VUE_APP_FIREBASE_APIKEY,
	"authDomain": process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
	"messagingSenderId": process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
	"appId": process.env.VUE_APP_FIREBASE_APPID
})

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

export const s3_bucket = process.env.VUE_APP_S3_BUCKET
export const s3 = new aws.S3({
	endpoint: process.env.VUE_APP_S3_ENDPOINT,
	accessKeyId: process.env.VUE_APP_S3_ACCESSKEYID,
	secretAccessKey: process.env.VUE_APP_S3_SECRETACCESSKEY
})
export const auth = firebase.auth()
