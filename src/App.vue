<template>
  <w-calendar
		:locale="language"
		:key="language"
		:events="events"
		@getCurrentPeriod="getCurrentPeriod"
		@getLocale="getLocale"
	/>
</template>

<script>
import {events} from "@/mock/events";
import WCalendar from "@/calendar/components/WCalendar.vue";

export default {
  name: 'App',
  components: {
		WCalendar,
  },
	data() {
		return {
			events: [],
			language: "en"
		}
	},
	mounted() {
		// dummy processing events to populate days
		this.events[this.moment().format("YYYY-MM-DD")] = events;
		this.events[this.moment().add(1, "week").format("YYYY-MM-DD")] = events;
		this.events[this.moment().add(1, "month").format("YYYY-MM-DD")] = events;

		let noDays = 0;
		do {
			let months = Math.floor(Math.random() * 12);
			let days = Math.floor(Math.random() * 30);
			this.events[this.moment().add(months, "month").add(days, "day").format("YYYY-MM-DD")] = events;
			this.events[this.moment().subtract(months, "month").add(days, "day").format("YYYY-MM-DD")] = events;
			noDays ++;
		} while (noDays < 50);

	},
	methods: {
		/**
		 * @param {Date} data
		 */
		getCurrentPeriod(data) {
			console.log("current period", data);
		},
		/**
		 * @param {String} data
		 */
		getLocale(data) {
			console.log("current locale", data);
		},
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>