<template>
	<button @click="prevDate">
		<font-awesome-icon :icon="['fas', 'chevron-left']" />
	</button>
	<div class="label">
		<input
			type="text"
			readonly
			:value="title"
			@click="showPopup"
			@blur="closePopup"
		/>

		<span
			v-if="chooseDate"
			class="list-dates"
			:class="{ 'popup-animation': chooseDate }"
			@wheel.passive="onWheel"
			@mouseover="overPeriod"
			@mouseleave="leavePeriod"
		>
      <button
        class="up-period"
        title="Use scroll as well"
        @click="clickUpPeriod"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
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
      <button
        class="down-period"
        title="Use scroll as well"
        @click="clickDownPeriod">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>

			<div class="buttons">
				<button
					class="today-btn"
					@click="setTodayDate"
				>
					<font-awesome-icon :icon="['fas', 'thumbtack']" />
					Today
				</button>

				<button
					class="close-btn"
					@click="hidePopup"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
					Close
				</button>
			</div>

		</span>

	</div>
	<button @click="nextDate">
		<font-awesome-icon :icon="['fas', 'chevron-right']" />
	</button>
</template>

<script>

import {MonthType} from "@/calendar/types/MonthType";

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
			isOverPeriod: false,
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
		 * Try to close popup if it's possible
		 */
		closePopup() {
			if (!this.isOverPeriod) {
				this.hidePopup();
			}
		},
		/**
		 * We scroll over list of periods
		 */
		overPeriod() {
			this.isOverPeriod = true;
		},
		/**
		 * We leave scrolling periods
		 */
		leavePeriod() {
			this.isOverPeriod = false;
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
    /**
     * Click on arrow button to choose a prev date
     */
    clickUpPeriod() {
      this.middlePeriod = this.calendarType.subtractUnit(this.middlePeriod);
    },
    /**
     * Click on arrow button to choose a next date
     */
    clickDownPeriod() {
      this.middlePeriod = this.calendarType.addUnit(this.middlePeriod);
    }
	}
};

</script>