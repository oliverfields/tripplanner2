<template>
	<div class="home">
		<Menu />
		<Workspace />
	</div>
</template>

<script>
import Menu from '@/components/Menu'
import Workspace from '@/components/Workspace'

export default {
	name: 'home',
	components: {
		Menu,
		Workspace
	}
}
</script>
