<template>

	<div class="header">

		<div class="left">
			<button
				v-for="calendar in calendarTypes"
				:key="calendar.type"
				:class="{ 'selected': calendarType === calendar.type }"
				@click="switchCalendarType(calendar.type)"
			>
				<font-awesome-icon :icon="calendar.icon" />
				{{ calendar.label }}
			</button>
		</div>

		<div class="center">
			<u-i-period
				:title="title"
				:period="period"
				:calendar-type="calendarType"
				@nextDate="nextDate"
				@prevDate="prevDate"
				@setDate="setDate"
			/>
		</div>

		<div
			class="right"
		>
			<button
				v-for="language in locales"
				:key="language.code"
				:class="{ 'selected': language.code === locale }"
				@click="setLocale(language.code)"
			>
				{{ language.label }}
			</button>
		</div>

	</div>

	<div class="container">

		<div
			class="calendar"
			:class="{
				'calendar-lines-1': month.weeks.length === 1,
				'calendar-lines-4': month.weeks.length === 4,
				'calendar-lines-5': month.weeks.length === 5,
				'calendar-lines-6': month.weeks.length === 6,
				'calendar-columns-1': isDayType(),
				'slide-left': slideLeft,
				'slide-right': slideRight
			}"
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
            'week_day_inactive': !day.active,
            'week_day_current': day.current,
            'week_day_selected': day.selected,
            'week_day_weekend': day.isWeekend
          }"
				>
					<u-i-events
						:day="day"
						:events="getEventsByDay(day)"
						@setCurrentDate="eventsSetCurrentDate"
					/>
				</div>

			</template>

		</div>
	</div>
</template>

<script>

import {Month} from "@/calendar/models/MonthModel";
import {Day} from "@/calendar/models/DayModel";
import {MonthType} from "@/calendar/types/MonthType";
import {WeekType} from "@/calendar/types/WeekType";
import {DayType} from "@/calendar/types/DayType";
import UIPeriod from "@/calendar/components/UIPeriod.vue";
import moment from "moment";
import UIEvents from "@/calendar/components/UIEvents.vue";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
	name: "UICalendar",
	components: {UIEvents, UIPeriod},
	props: {
		currentPeriod: {
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
			period: null, // current period viewed in the calendar
			calendarType: MonthType, // default calendar type viewing
			calendarTypes: [{ // available calendar types
				type: MonthType,
				label: "Month",
				icon: ["fas", "table"],
			}, {
				type: WeekType,
				label: "Week",
				icon: ["fas", "table-columns"],
			}, {
				type: DayType,
				label: "Day",
				icon: ["far", "square"],
			}],
			locales: [{
				code: "ro",
				label: "RO"
			}, {
				code: "fr",
				label: "FR"
			}, {
				code: "en",
				label: "EN"
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
		 * @return {[String]}
		 */
		weekDays() {
			if (this.isDayType()) {
				return [
					this.moment(this.period)
						.locale(this.locale)
						.format("dddd")
						.ucfirst()
				];
			}

			return Array.from(this.moment.weekdays(true)).map(item => item.ucfirst());
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
				let day = new Day(this.moment(calendarDay));
				day.active = this.isActiveDay(calendarDay);
				day.current = this.isCurrentDay(calendarDay);
				day.selected = this.isSelectedDay(calendarDay);

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
		this.moment.locale(this.locale);
		this.period = this.currentPeriod;
	},
	methods: {
		/**
		 * Check of calendar view is on monde Day
		 * @return {boolean}
		 */
		isDayType() {
			return this.calendarType instanceof DayType.constructor;
		},
		/**
		 * Choose viewing strategy
		 * @param calendarType
		 * @return {Promise<void>}
		 */
		switchCalendarType(calendarType) {
			this.calendarType = calendarType;
		},
		/**
		 * Calculate previously period based on chosen strategy
		 * @return {Promise<void>}
		 */
		prevDate() {
			this.slideRight = true;
			this.emitSelectedDate();
		},
		/**
		 * Calculate next period based on chosen strategy
		 * @return {Promise<void>}
		 */
		nextDate() {
			this.slideLeft = true;
			this.emitSelectedDate();
		},
		/**
		 * Catch date from period component
		 * @param value
		 */
		setDate(value) {
			this.period = value;
		},
		/**
		 * Check if a day is active or not - if a day is part of the current month
		 * @param {Date} date
		 * @return {boolean}
		 */
		isActiveDay(date) {
			return this.moment(this.period).month() === this.moment(date).month();
		},
		/**
		 * Check if a day was selected
		 * @param {Date} date
		 * @return {boolean}
		 */
		isSelectedDay(date) {
			return this.moment(this.period).format("YYYY-MM-DD") === this.moment(date).format("YYYY-MM-DD");
		},
		/**
		 * Check if a day is current calendaristic day
		 * @param {Date} date
		 * @return {boolean}
		 */
		isCurrentDay(date) {
			return this.moment().format("YYYY-MM-DD") === this.moment(date).format("YYYY-MM-DD");
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
		 * End of transition left or right
		 */
		transitionEnd() {
			let period = this.moment(this.period).toDate();

			if (this.slideLeft) {
				this.period = this.calendarType.nextDate(period);
			} else if (this.slideRight) {
				this.period = this.calendarType.prevDate(period);
			}

			this.slideLeft = this.slideRight = false;
		},
		/**
		 * Retrieve date for selected events component
		 * @param day
		 */
		eventsSetCurrentDate(day) {
			this.setDate(day.date);
			this.calendarType = DayType;
		},
		/**
		 * Retrieve current selected date
		 */
		emitSelectedDate() {
			this.$emit("getCurrentPeriod", this.period);
		},
		/**
		 * Get list of event by day
		 * @param {Day} day
		 * @return {Array}
		 */
		getEventsByDay(day) {
			let date = day.date.format("YYYY-MM-DD");
			return this.events[date] ? this.events[date] : [];
		},
		/**
		 * Retrieve current selected locale
		 * @param {String} lang
		 */
		setLocale(lang) {
			this.$emit("getLocale", lang);
		}
	}
};

</script>

<style scoped>

/**  START header **/
.header {
	position: fixed;
	display: flex;
	flex-direction: row;
	height: 60px;
	padding-top: 5px;
	width: 100%;
	align-items: center;
	text-align: center;
}

.header button {
	padding: 5px;
	margin-right: 4px;
	border: solid 1px #a1a1a1;
	background-color: #f1f1f1;
	border-radius: 7px;
	cursor: pointer;
	font-size: 12px;
}

.header button:hover {
	background-color: #c9c9c9;
	animation: fadeBackgroundButton 0.5s;
	animation-fill-mode: forwards;
}

.header button.selected {
	background-color: #5188c4;
	border: solid 2px #2b5d93;
	color: #fff;
}

.header button.selected:hover {
	background-color: #5188c4;
	animation: fadeBackgroundButtonSelected 0.5s;
	animation-fill-mode: forwards;
}

/** END left **/
.header .left {
	width: 400px;
	text-align: left;
	padding-left: 10px;
}

.header .left button {
	width: 80px;
}
/** END left **/

/** START center **/
.header .center {
	width: 100%;
}

.header .center :deep(button) {
	padding: 7px;
	width: 30px;
	height: 30px;
	border: solid 1px #a1a1a1;
	background-color: #f1f1f1;
	border-radius: 30px;
	cursor: pointer;
}

.header .center :deep(button:hover) {
	animation: fadeBackgroundButton 0.5s;
	animation-fill-mode: forwards;
}

.header .center :deep(.label) {
	display: inline-block;
	width: 300px;
	padding: 7px;
	margin: 0 5px 0 5px;
	border: solid 1px #a1a1a1;
	background-color: #fff;
	border-radius: 7px;
}

.header .center :deep(.popup) {
	border: solid 1px #a1a1a1;
	padding: 1px;
	box-shadow: 0 2px 9px #a1a1a1;
}

.header .center :deep(.popup) span span {
	cursor: pointer;
	padding: 7px;
	text-align: left;
}

.header .center :deep(.popup) > span.selected,
.header .center :deep(.popup) > span:hover {
	outline: 2px solid #5188c4;
	outline-offset: -2px;
	animation: fadeBackgroundPeriod 0.5s;
	animation-fill-mode: forwards;
}

@keyframes fadeBackgroundPeriod {
	from { background-color: #ffffff; }
	to { background-color: #e0f1ff; }
}
/** END center **/

/** START right **/
.header .right {
	width: 400px;
	text-align: right;
	padding-right: 10px;
}
/** END right **/


@keyframes fadeBackgroundButton {
	from {
		background-color: #f1f1f1;
		color: #000;
	}
	to {
		background-color: #c9c9c9;
		color: #000;
	}
}

@keyframes fadeBackgroundButtonSelected {
	from {
		background-color: #5188c4;
		color: #fff;
	}
	to {
		background-color: #5188c4;
		color: #fff;
	}
}

/** END header **/


.container {
	padding: 60px 10px 10px 10px;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #d7d7d7;
	border-top: solid 2px #5188c4;
	overflow: auto;
}

.calendar {
	display: grid;
	grid-template-columns: 30px repeat(7, 1fr);
	grid-template-rows: 30px repeat(5, 1fr);
	gap: 1px;
	height: 100%;
}

.calendar-lines-1 {
	grid-template-rows: 30px repeat(1, 1fr);
}

.calendar-lines-4 {
	grid-template-rows: 30px repeat(4, 1fr);
}

.calendar-lines-5 {
	grid-template-rows: 30px repeat(5, 1fr);
}

.calendar-lines-6 {
	grid-template-rows: 30px repeat(6, 1fr);
}

.calendar-columns-1 {
	grid-template-columns: 30px auto;
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
	background-color: #fff;
	display: flex;
	flex-direction: column;
	overflow: auto;
}

.calendar .week_day_inactive {
	background-color: #efefef;
	color: #9d9d9d;
}

.calendar .week_day_current :deep(.day),
.calendar .week_day_weekend :deep(.day) {
	color: #fff;
	font-weight: bold;
	border-radius: 10px;
	margin: 1px;
	padding-left: 5px;
}

.calendar .week_day_weekend :deep(.day) {
	background-color: #cae7f8;
	color: #000;
	font-weight: normal;
}

.calendar .week_day_current :deep(.day) {
	background-color: #ff5f5f;
	color: #fff;
	font-weight: bold;
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