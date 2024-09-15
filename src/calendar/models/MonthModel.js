import { Week } from "@/calendar/models/WeekModel";
import { markRaw } from "vue";

/**
 * Model for a month
 */
export class Month {

	/**
	 * List of weeks
	 * @type {[Week]}
	 */
	weeks = [];

	/**
	 * Add a day to the last week of month
	 * @param {Day} day
	 */
	addDay(day) {
		let lastWeek = this.lastWeek();
		if (!lastWeek || lastWeek.isFull()) {
			lastWeek = markRaw(new Week(day.date));
			this.weeks.push(lastWeek);
		}
		lastWeek.addDay(day);
	}

	/**
	 * Return last week of month
	 * @return {Week}
	 */
	lastWeek() {
		return this.weeks.at(- 1);
	}

	*[Symbol.iterator]() {
		for (let week of this.weeks) {
			yield week;
		}
	}
}