<template>
	<div id="app">
		<img alt="Vue Logo" src="./assets/logo.png" />
		<Form />
		<Display />
		<Todo />
		<router-view/>
	</div>
</template>

<script>
import Todo from './components/Todo'
import Form from './components/Form'
import Display from './components/Display'

export default {
	name: 'App',
	components: {
		Form,
		Display,
		Todo
	}
}
</script>

<style>
* {
  box-sizing:border-box;
}

body, html, #app {
  background:#8ac8e5;
}

.home {
  width:300px;
  margin:auto;
}

#vue-logo {
  width:100px;
}

input, button {
  border:0;
  width:100%;
  margin:0 0 10px;
  padding:7px;
}

input {
  font-size:12px;
}

button {
  background:#43b823;
  border:0;
  text-transform:uppercase;
  color:#fff;
  font-weight:700;
  cursor:pointer;
}

.title {
  font-size:14px;
  font-weight:700;
  padding:0 0 10px 0;
  margin:0 0 10px 0;
  border-bottom:1px solid #666;
}

#error {
  background:#a52222;
  color:#fff;
  padding:5px;
}
</style>
