<template>
	<div id="Init">
		<top class="top"></top>
		<transition >
			<router-view >
				
			</router-view>
		</transition>
	</div>
</template>
<script>

	import Top from './top.vue'
	import { store } from '../../store'

	export default {
		components: { Top },
		data(){
			return {}
		}
	}

</script>
<style>
	html, body {
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
	#Init{
		height:100%;
	}
</style>