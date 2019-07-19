<template>
	<div class="login">
		<h3>Sign in</h3>
		<input type="text" v-model="email" placeholder="Email"><br>
		<input type="password" v-model="password" placeholder="Password"><br>
		<button @click="login">Connection</button>

		<p>
			Sign in with Google<br />
			<button class="social-button" @click="googleLogin">
				<img alt="Google logo" src="../../assets/google-logo.png" />
			</button>
		</p>

		<p>I need a <router-link to="/sign-up">new account</router-link>!</p>
	</div>
</template>

<script>
import firebase from 'firebase';
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
			firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
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
			firebase.auth().signInWithPopup(provider).then((resutl) => {
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
