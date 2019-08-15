<template>
	<div id="app">
		<Menu />
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
</style>
