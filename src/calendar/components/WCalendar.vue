<template>
	<u-i-calendar
		:locale="currentLocale"
		:current-period="currentPeriod"
		:events="events"
		@getLocale="getLocale"
		@getCurrentPeriod="getCurrentPeriod"
	/>
</template>

<script>
import UICalendar from "@/calendar/components/UICalendar.vue";
import moment from "moment/moment";

export default {
	name: "WCalendar",
	components: {
		UICalendar,
	},
	props: {
		period: {
			type: Object,
			default: () => moment(),
		},
		locale: {
			type: String,
			validator(value) {
				return ["ro", "fr", "en"].includes(value);
			},
		},
		events: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["getCurrentPeriod", "getLocale"],
	data() {
		return {
			currentLocale: null,
			currentPeriod: null,
		}
	},
	beforeMount() {
		this.currentLocale = this.locale;
		this.currentPeriod = this.period;
	},
	methods: {
		/**
		 * @param {String} locale
		 */
		getLocale(locale) {
			this.currentLocale = locale;
			this.$emit("getLocale", this.currentLocale);
		},
		/**
		 * @param {Date} period
		 */
		getCurrentPeriod(period) {
			this.currentPeriod = period;
			this.$emit("getCurrentPeriod", this.currentPeriod);
		}
	}
}
</script>

<style lang="scss">
@import "../assets/templates/default/style";
</style>