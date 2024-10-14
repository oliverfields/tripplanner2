<template>
	<div class="login">
		<h1>Welcome</h1>
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
