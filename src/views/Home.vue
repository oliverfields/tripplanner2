<template>
	<div class="home">
		<Menu />
		<Workspace />
	</div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase';
import Menu from '@/components/Menu'
import Workspace from '@/components/Workspace'

export default {
	name: 'home',
	components: {
		Menu,
		Workspace
	},
	methods: {
	}
}
</script>
