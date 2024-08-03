<template>
  <u-i-calendar
		@currentDate="getCurrentDate"
	/>
</template>

<script>
import UICalendar from "@/components/UICalendar.vue";

export default {
  name: 'App',
  components: {
		UICalendar,
  },
	data() {
		return {
		}
	},
	methods: {
		/**
		 * @param {String} data
		 */
		getCurrentDate(data) {
			console.log(data);
		}
	}
}
</script>

<style>
html, body {
	margin: 0;
	padding: 0;
	height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
