<template>
  <u-i-calendar
		locale="en"
		:events="events"
		@currentDate="getCurrentDate"
	/>
</template>

<script>
import UICalendar from "@/components/UICalendar.vue";
import {events} from "@/mock/events";

export default {
  name: 'App',
  components: {
		UICalendar,
  },
	data() {
		return {
			events: [],
		}
	},
	mounted() {
		// dummy processing events to populate some days
		this.events[this.moment().format("YYYY-MM-DD")] = events;
		this.events[this.moment().add(1, "week").format("YYYY-MM-DD")] = events;
		this.events[this.moment().add(1, "month").format("YYYY-MM-DD")] = events;
		this.events[this.moment().add(25, "day").format("YYYY-MM-DD")] = events;
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
	font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>