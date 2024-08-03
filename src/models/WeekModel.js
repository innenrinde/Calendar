/**
 * Model for a week
 */
export class Week {

	/**
	 * List of days
	 * @type {[Day]}
	 */
	#days = [];

	/**
	 * @type {Moment}
	 */
	date = null;

	/**
	 * @param {Moment} date
	 */
	constructor(date) {
		this.date = date;
		this.#days = [];
	}

	/**
	 * Add a day
	 * @param {Day} day
	 */
	addDay(day) {
		this.#days.push(day);
	}

	/**
	 * Check if the week is a complete list of days
	 * @return {boolean}
	 */
	isFull() {
		return this.#days.length === 7;
	}

	*[Symbol.iterator]() {
		for (let day of this.#days) {
			yield day;
		}
	}
}