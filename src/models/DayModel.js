/**
 * Model for a day
 */
export class Day {

	// if day is active or not; boolean prop to do extra conditions
	#active = false;

	// if current calendaristic day
	#current = false;

	// if is selected day
	#selected = false;

	/**
	 * @param {Moment} date date of the month
	 */
	constructor(date) {
		this.date = date;
	}

	/**
	 * @param {boolean} value
	 */
	set active(value) {
		this.#active = value;
	}

	/**
	 * @return {boolean}
	 */
	get active() {
		return this.#active;
	}

	/**
	 * @param {boolean} value
	 */
	set current(value) {
		this.#current = value;
	}

	/**
	 * @return {boolean}
	 */
	get current() {
		return this.#current;
	}

	/**
	 * @param {boolean} value
	 */
	set selected(value) {
		this.#selected = value;
	}

	/**
	 * @return {boolean}
	 */
	get selected() {
		return this.#selected;
	}

	/**
	 * Number of day in month
	 * @returns {number}
	 */
	get number() {
		return this.date.date();
	}
}