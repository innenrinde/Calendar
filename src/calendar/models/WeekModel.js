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
	 * @param {Moment} date
	 */
	constructor(date= null) {

		// current date
		this.date = date;

		// list of week days
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