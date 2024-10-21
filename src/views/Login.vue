<template>
  <div class="login bg-dark">
    <h1>Ambulate.app</h1>
    <div class="login-option">
      <div class="btn btn-success" @click="googleLogin">Login with Google user</div>
    </div>
    <div class="login-option">
      <div><input type="text" v-model="email" placeholder="Email"><br /><input type="password" v-model="password" placeholder="Password"><br /><button class="btn btn-success" @click="login">Login</button></div>
    </div>
    <div class="login-option">
      <div style="color: #343a40;">Create <router-link to="/sign-up">new account</router-link></div>
    </div>
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
width: 400px;
margin: 4em auto;
color: white;
text-align: center;
padding: 1em;
}
.login-option {
background-color: white;
padding: 1em;
margin: 1em 0;
}
input {
margin: 1em 0;
padding: .5em;
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
.or {
margin: 1em;
font-style: italic;
font-size: 1.2em;
}
</style>
