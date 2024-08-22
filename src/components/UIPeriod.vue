<template>
	<div>
		<button @click="prevDate">&lt;</button>
		<div class="label">
			<input
				type="text"
				readonly
				:value="title"
				@click="showPopup"
			/>

			<span
				v-if="chooseDate"
				class="popup"
				@wheel.passive="onWheel"
			>
				<span
					v-for="item in options"
					:key="item"
					:class="{ 'selected': item.selected, 'no-value': !item.value }"
					@click="setDate(item.value)"
				>
					{{ item.label }}
				</span>

				<button
					class="today"
					@click="setTodayDate()"
				>
					Today
				</button>

			</span>

		</div>
		<button @click="nextDate">&gt;</button>
	</div>
</template>

<script>

import {MonthType} from "@/types/MonthType";

export default {
	name: "UIPeriod",
	props: {
		title: {
			type: String,
			default: () => "",
		},
		period: {
			type: Object,
			default: () => null,
		},
		calendarType: {
			type: Object,
			default: () => MonthType
		}
	},
	emits: ["nextDate", "prevDate", "setDate"],
	data() {
		return {
			chooseDate: false,
			middlePeriod: null,
		};
	},
	watch: {
		period() {
			this.middlePeriod = this.period;
		}
	},
	computed: {
		options() {
			return this.calendarType.options(this.period, this.middlePeriod);
		}
	},
	mounted() {
		this.middlePeriod = this.period;
	},
	methods: {
		/**
		 * Go to previously period
		 */
		prevDate() {
			this.$emit("prevDate");
		},
		/**
		 * Go to next period
		 */
		nextDate() {
			this.$emit("nextDate");
		},
		/**
		 * Select a new date
		 * @param {Object} value
		 */
		setDate(value) {
			if (value) {
				this.hidePopup();
				this.$emit("setDate", value);
			}
		},
		setTodayDate() {
			this.hidePopup();
			this.$emit("setDate", this.moment());
		},
		/**
		 * Open calendar dates list
		 */
		showPopup() {
			this.chooseDate = !this.chooseDate;
		},
		/**
		 * Hide calendar dates list
		 */
		hidePopup() {
			this.chooseDate = false;
		},
		/**
		 * Scroll up-down into dates list
		 * @param event
		 */
		onWheel(event) {
			if (event.deltaY > 0) {
				this.middlePeriod = this.calendarType.addUnit(this.middlePeriod);
			} else {
				this.middlePeriod = this.calendarType.subtractUnit(this.middlePeriod);
			}
		},
	}
};

</script>

<style scoped>
.label {
	position: relative;
}

.label input,
.label input:focus {
	border: none;
	outline: none;
	background-color: transparent;
	width: 100%;
	text-align: center;
	cursor: pointer;
}

.popup {
	position: absolute;
	top: 35px;
	left: 0;
	right: 0;
	margin: 0 auto;
	text-align: center;
	width: auto;
	background-color: white;
	z-index: 999;
	display: flex;
	flex-direction: column;
}

.popup span:hover,
.popup span.selected {
	background-color: #9d9d9d;
}

.popup span.no-value {
	border-top: solid 1px #9d9d9d;
	border-bottom: solid 1px #9d9d9d;
	background-color: #f1f1f1;
	margin: 1px 0 1px 0;
	font-weight: bold;
	text-align: right !important;
	padding-top: 2px !important;
	padding-bottom: 2px !important;
}

.today {
	border-radius: 2px !important;
	width: 100% !important;
}
</style>