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
					class="item"
					:class="{ 'selected': item.selected }"
					@click="setDate(item.value)"
				>
					<span>{{ item.label }}</span>
					<span
						:style="{'background-color': item.color }"
						class="marker"
					>{{ item.marker }}</span>
				</span>

				<div class="buttons">
					<button
						class="today-btn"
						@click="setTodayDate()"
					>
						Today
					</button>

					<button
						class="close-btn"
						@click="showPopup()"
					>
						Close
					</button>
				</div>

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

.label input:hover {
	color: #2b5d93;
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
	flex-direction: column;
}

.popup span.item {
	display: flex;
	flex-direction: row;
}

.popup span.item span:first-child {
	width: 100%;
}

.popup span.item span {
	white-space: nowrap;
}

.popup span:hover,
.popup span.selected {
}

.buttons {
	display: flex;
	flex-direction: row;
}

.buttons button {
	border-radius: 2px !important;
	margin: 2px;
}

.today-btn {
	width: 70% !important;
}

.close-btn {
	width: 30% !important;
}


</style>