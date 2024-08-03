/**
 * Model for a day
 */
export class Day {

	/**
	 * @type {Moment}
	 */
	date = null;

	/**
	 * @param {Moment} date date of the month
	 * @param {Boolean} active
	 */
	constructor(date, active = true) {
		this.date = date;
		this.active = active;
	}

	/**
	 * Retourne le jour du mois
	 * @returns {number}
	 */
	get number() {
		return this.date.date();
	}
}