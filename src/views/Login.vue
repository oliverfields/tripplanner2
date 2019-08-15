<template>
	<div class="login">
		<h1>Trip planner</h1>
		<h2>Login with Google user</h2>

		<div>
			<button class="social-button" @click="googleLogin">
				<img alt="Google logo" src="images/google-logo.png" />
			</button>
		</div>

		<h2>.. or local user</h2>
		<div>
			<input type="text" v-model="email" placeholder="Email"><br>
			<input type="password" v-model="password" placeholder="Password"><br>
			<button @click="login">Login</button>
		</div>


		<p>I need a <router-link to="/sign-up">new account</router-link>!</p>
	</div>
</template>

<script>
import firebase from 'firebase'
import { auth } from '@/main'

export default {
	name: 'login',
	data() {
		return {
			email: '',
			password: ''
		};
	},
	methods: {
		login: function() {
			auth.signInWithEmailAndPassword(this.email, this.password).then(
				(user) => {
					this.$router.replace('home')
				},
				(err) => {
					alert('Nope.. ' + err.message)
				}
			);
		},
		googleLogin() {
			const provider = new firebase.auth.GoogleAuthProvider();
			auth.signInWithPopup(provider).then((result) => {
				this.$router.replace('home');
			}).catch((err) => {
				alert('Nope.. ' + err.message)

			});
		}
	}
}
</script>

<style scoped>
.login {
margin-top: 40px;
}
input {
margin: 10px 0;
width: 20%;
padding: 15px;
}
button {
margin-top: 20px;
widht: 10%;
cursor: pointer;
}
p {
margin-top: 40px;
font-size: 13px;
}
p a {
text-decoration: underline;
cursor: pointer;
}
.social-button {
width: 75px;
background: white;
padding: 10px;
border-radius: 100%;
outline: 0;
box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
border: 0;
}
.social-button:active {
box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
}
.social-button img {
width: 100%;
}
</style>
