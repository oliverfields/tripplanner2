<template>
  <div class="sign-up bg-dark">
    <h1>Ambulate.app</h1>
    <div class="login-option">
      <h2>Create account</h2>
      <input type="text" v-model="email" placeholder="Email" /><br />
      <input type="password" v-model="password" placeholder="Password" /><br />
      <button class="btn btn-success" @click="signUp">Sign up</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'SignUp',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('home')
        },
        (err) => {
          alert('Oh dear. ' + err.message)
        }
      );
    }
  }
}
</script>

<style scoped>
.sign-up {
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
h2 {
color: #343a40;
}
input {
margin: 1em 0;
padding: .5em;
}
</style>
