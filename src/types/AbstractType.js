import moment from "moment/moment";

/**
 * Type of calendar view: by month, by weeks, by days
 */
export class AbstractType {

	/**
	 * Available colors for right markers in list of periods
	 * @type {array}
	 */
	colors = ["#e9bcf6", "#fef8e5", "#b3e5ff", "#c4c3f4", "#fedcbc"];

	/**
	 * Default type of unit for calendar view
	 * @type {DurationInputArg2}
	 */
	unit = "day";

	constructor() {
		if (this.constructor === AbstractType) {
			throw new Error("Cannot instantiate abstract class");
		}
	}

	/**
	 * Title of a date based on calendar type
	 * @param {Date} date
	 * @param {String} format
	 * @returns {String}
	 */
	title(date, format = "YYYY-MM-DD") {
		return moment(date).format(format);
	}

	/**
	 * List available options to be display in drop down dates
	 * @param {Date} date
	 * @param {Date} middleDate
	 * @return {Array}
	 */
	options(date, middleDate = null) {

		middleDate = middleDate ?? date;

		let currentDate = moment(middleDate)
			.startOf(this.unit)
			.subtract(7, this.unit);

		let items = [];
		while (items.length < 15) {

			items.push({
				label: this.periodTitle(currentDate.toDate()),
				value: moment(currentDate),
				selected: this.isEquals(currentDate, date),
				marker: this.markerLabel(currentDate),
				color: this.colors[this.marker(currentDate)%5]
			});

			currentDate.add(1, this.unit);
		}

		return items;
	}

	/**
	 * Check if two dates are equals
	 * @param {Date} date1
	 * @param {Date} date2
	 * @return {boolean}
	 */
	isEquals(date1, date2) {
		return moment(date1)
				.startOf(this.unit)
				.format("YYYY-MM-DD") ===
			moment(date2)
				.startOf(this.unit)
				.format("YYYY-MM-DD")
	}

	/**
	 * Displayed title in top list of periods
	 * @param {Date} date
	 * @return {string}
	 */
	periodTitle(date) {
		return moment(date).format("YYYY-MM-DD");
	}

	/**
	 * Displayed right marker of each period in list of periods
	 * @param {Date} date
	 * @return {string}
	 */
	markerLabel(date) {
		return moment(date).format("YYYY");
	}

	/**
	 * Number to check color of right marker
	 * @param {Date} date
	 * @return {number}
	 */
	marker(date) {
		return parseInt(moment(date).format("YYYY"));
	}

	/**
	 * Add a unit to a date
	 * @param {Date} date
	 * @return {moment.Moment}
	 */
	addUnit(date) {
		return moment(date).add(1, this.unit);
	}

	/**
	 * Subtract a unit from a date
	 * @param {Date} date
	 * @return {moment.Moment}
	 */
	subtractUnit(date) {
		return moment(date).subtract(1, this.unit);
	}

}