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
						:is-day-type="isDayType()"
						@setCurrentDate="eventsSetCurrentDate"
						@event="selectEvent"
					/>
				</div>

			</template>

		</div>
	</div>

	<u-i-popup
		v-if="selectedEvent"
		:event="selectedEvent"
		@close="closeEvent"
	/>
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
import UIPopup from "@/calendar/components/UIPopup.vue";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
	name: "UICalendar",
	components: {
    UIPopup,
    UIEvents,
    UIPeriod
  },
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
			weekDays: [], // list of week day based on locale and calendar type
			month: {}, // list of week for selected month
			slideLeft: false,
			slideRight: false,
			selectedEvent: null,
		};
	},
	watch: {
		locale() {
			this.moment.locale(this.locale);
			this.calculateCalendarViewDates();
		},
		calendarType() {
			this.calculateCalendarViewDates();
		}
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
	},
	/**
	 * Init current period to instantiate calendar
	 */
	beforeMount() {
		this.moment.locale(this.locale);
		this.period = this.currentPeriod;
		this.calculateCalendarViewDates();
	},
	methods: {
		/**
		 * Build list of week days and list of month calendaristic days
		 */
		calculateCalendarViewDates() {
			this.calculateWeekDays();
			this.calculateMonth();
		},
		/**
		 * Return week days as array of strings (short names of days)
		 * @return {[String]}
		 */
		calculateWeekDays() {
			if (this.isDayType()) {
				this.weekDays = [
					this.moment(this.period)
						.format("dddd")
						.ucfirst()
				];
			} else {
				this.weekDays = Array.from(this.moment.weekdays(true)).map(item => item.ucfirst());
			}
		},
		/**
		 * List of days grouped by weeks for selected period
		 * @return {Month}
		 */
		calculateMonth() {

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

			this.month = monthObj;
		},
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
		},
		/**
		 * Calculate next period based on chosen strategy
		 * @return {Promise<void>}
		 */
		nextDate() {
			this.slideLeft = true;
		},
		/**
		 * Catch date from period component
		 * @param value
		 */
		setDate(value) {
			this.period = value;
			this.emitSelectedDate();
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

      this.emitSelectedDate();
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
		 * Show clicked event
		 * @param {Object} event
		 */
		selectEvent(event) {
			this.selectedEvent = event;
		},
		/**
		 * Close popup event
		 */
		closeEvent() {
			this.selectedEvent = null;
		},
		/**
		 * Retrieve current selected date
		 */
		emitSelectedDate() {
			this.calculateCalendarViewDates();
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