<template>
	<div class="container">

		<div class="header">
			<div class="period">
				<button @click="prevDate">&lt;</button>
				<label>{{ title }}</label>
				<button @click="nextDate">&gt;</button>
			</div>

			<div class="types">
				<button
					v-for="calendar in calendarTypes"
					:key="calendar.type"
					:class="{ 'selected': calendarType === calendar.type }"
					@click="switchCalendarType(calendar.type)"
				>
				{{ calendar.label }}
				</button>
			</div>
		</div>

		<div
			class="calendar"
			:class="{
				'day_type': calendarType === DayType,
				'week_type': calendarType === WeekType,
				'slide-left': slideLeft,
				'slide-right': slideRight
			}"
			@wheel="onWheel"
			@transitionend="transitionEnd"
		>

			<div class="blank" />
			<div
				v-for="day in weekDays"
				:key="day"
				class="week_day_header"
			>
				{{ day }}
			</div>

			<template
				v-for="(week, keyw) in month"
				:key="'week' + keyw"
			>
				<div
					class="week_no"
				>
					W{{ weekNumber(week) }}
				</div>
				<div
					v-for="day in week"
					:key="weekDayDate(day)"
					class="week_day"
					:class="{
            'week_day_inactive': !day.active
          }"
				>
					<label>
						{{ day.number }}
					</label>
				</div>

			</template>

		</div>
	</div>
</template>

<script>

import {Month} from "@/models/MonthModel";
import {Day} from "@/models/DayModel";
import {MonthType} from "@/lib/MonthType";
import {WeekType} from "@/lib/WeekType";
import {DayType} from "@/lib/DayType";
import moment from "moment";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
	name: "UICalendar",
	props: {
		dataCy: {
			type: String,
			default: null
		},
		currentPeriod: {
			type: String,
			default: () => moment().format("YYYY-MM-DD"),
		},
	},
	data() {
		return {
			period: null, // current period viewed in the calendar
			calendarType: MonthType, // default calendar type viewing
			calendarTypes: [{ // available calendar types
				type: MonthType,
				label: "Month"
			}, {
				type: WeekType,
				label: "Week"
			}, {
				type: DayType,
				label: "Day"
			}],
			slideLeft: false,
			slideRight: false,
		};
	},
	computed: {
		/**
		 * Instead of having a computed day type
		 * @return {DayType}
		 * @constructor
		 */
		DayType() {
			return DayType;
		},
		/**
		 * Instead of having a computed week type
		 * @return {WeekType}
		 * @constructor
		 */
		WeekType() {
			return WeekType;
		},
		/**
		 * Calendar title
		 * @return {String}
		 */
		title() {
			return this.calendarType.title(this.period);
		},
		/**
		 * Return week days as array of strings (short names of days)
		 * @return {string[]}
		 */
		weekDays() {
			if (this.calendarType === DayType) {
				return [this.moment(this.period).format("ddd")];
			}
			return Array.from(this.moment.weekdaysShort(true));
		},
		/**
		 * List of days grouped by weeks for selected period
		 * @return {Month}
		 */
		month() {
			let [calendarStart, calendarEnd] = this.calendarType.interval(this.period);

			// calendar month = weeks collection
			let monthObj = new Month();

			// add weeks into month - day by day
			let calendarDay = this.moment(calendarStart);
			while (calendarDay <= calendarEnd) {
				let day = new Day(this.moment(calendarDay), this.isActiveDay(calendarDay));
				monthObj.addDay(day);
				calendarDay.add(1, "days");
			}

			return monthObj;
		}
	},
	/**
	 * Init current period to instantiate calendar
	 */
	beforeMount() {
		this.period = this.currentPeriod;
	},
	methods: {
		/**
		 * Choose viewing strategy
		 * @param calendarType
		 * @return {Promise<void>}
		 */
		async switchCalendarType(calendarType) {
			this.calendarType = calendarType;
		},
		/**
		 * Calculate previously period based on chosen strategy
		 * @return {Promise<void>}
		 */
		async prevDate() {
			this.slideRight = true;
			this.emitSelectedDate();
		},
		/**
		 * Calculate next period based on chosen strategy
		 * @return {Promise<void>}
		 */
		async nextDate() {
			this.slideLeft = true;
			this.emitSelectedDate();
		},
		/**
		 * Check if a day is active or not - if a day is part of the current month
		 * @param date
		 * @return {boolean}
		 */
		isActiveDay(date) {
			return this.moment(this.period).month() === this.moment(date).month();
		},
		/**
		 * Return number of a week
		 * @param {Week} week
		 * @return {number}
		 */
		weekNumber(week) {
			return week.date.week();
		},
		/**
		 * Return calendar date of a given day
		 * @param {Day} day
		 * @return {String}
		 */
		weekDayDate(day) {
			return day.date.format(DATE_FORMAT);
		},
		/**
		 * @param event
		 */
		onWheel(event) {
			if (event.deltaY > 0) {
				this.nextDate();
			} else {
				this.prevDate();
			}
		},
		/**
		 * End of transition left or right
		 */
		transitionEnd() {
			if (this.slideLeft) {
				this.period = this.calendarType.nextDate(this.moment(this.period).toDate());
			} else if (this.slideRight) {
				this.period = this.calendarType.prevDate(this.moment(this.period).toDate());
			}
			this.slideLeft = false;
			this.slideRight = false;
		},
		/**
		 * Retrieve current selected date
		 */
		emitSelectedDate() {
			this.$emit("currentDate", this.period);
		},
	}
};

</script>

<style scoped>
.container {
	margin: 20px;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	flex-direction: row;
	margin-bottom: 10px;
}

.header .period {
	width: 100%;
	padding-left: 50px;
}

.header .period button {
	padding: 7px;
	width: 30px;
	height: 30px;
	border: solid 1px #a1a1a1;
	background-color: #f1f1f1;
	border-radius: 30px;
	cursor: pointer;
}

.header .period button:hover {
	background-color: #c9c9c9;
}

.header .period label {
	display: inline-block;
	width: 300px;
	padding: 7px;
	margin: 0 5px 0 5px;
	border: solid 1px #a1a1a1;
	border-radius: 7px;
}

.header .types {
	position: fixed;
}

.header .types button {
	padding: 5px;
	margin-right: 4px;
	width: 80px;
	border: solid 1px #a1a1a1;
	background-color: #f1f1f1;
	border-radius: 7px;
	cursor: pointer;
	font-size: 12px;
}

.header .types button.selected,
.header .types button:hover {
	background-color: #c9c9c9;
}

.calendar {
	display: grid;
	grid-template-columns: 30px repeat(7, auto);
	grid-template-rows: 30px repeat(5, auto);
	gap: 1px;
	height: 100%;
}

.week_type {
	grid-template-rows: 30px auto;
}

.day_type {
	grid-template-columns: 30px auto;
	grid-template-rows: 30px auto;
}

.calendar > div {
	border: solid 1px #a1a1a1;
	display: grid;
	align-content: center;
}

.calendar .blank,
.calendar .week_no,
.calendar .week_day_header {
	display: grid;
	align-content: center;
	color: #fff;
	background-color: #5188c4;
	border: solid 1px #2b5d93;
}

.calendar .week_day {
	min-height: 100px;
}

.calendar .week_day > div {
	height: 100%;
}

.calendar .week_day_inactive {
	opacity: 0.6;
	background-color: #f1f1f1;
	color: #9d9d9d;
}

.slide-right,
.slide-left {
	visibility: visible;
	transition: all .30s ease;
}

.slide-right {
	transform: translateX(100%) rotate(0deg);
}

.slide-left {
	transform: translateX(-100%) rotate(0deg);
}
</style>