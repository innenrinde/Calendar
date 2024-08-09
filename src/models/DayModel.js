/**
 * Model for a day
 */
export class Day {

	/**
	 * @param {Moment} date date of the month
	 * @param {Boolean} active
	 */
	constructor(date, active = true) {

		// current date
		this.date = date;

		// if day is active or not; boolean prop to do extra conditions
		this.active = active;
	}

	/**
	 * Number of day in month
	 * @returns {number}
	 */
	get number() {
		return this.date.date();
	}
}