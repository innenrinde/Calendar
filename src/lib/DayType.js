import moment from "moment";

export class DayType {

	/**
	 * @param {Date} date
	 * @returns {String}
	 */
	static title(date) {
		let dateStart = moment(date)
			.format("DD MMMM YYYY");

		return `${dateStart}`;
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static nextDate(date) {
		return new moment(date).add(1, "days").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static prevDate(date) {
		return new moment(date).subtract(1, "days").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {moment.Moment[]}
	 */
	static interval(date) {
		let dateStart = moment(date).startOf("day");
		let dateEnd = moment(date).endOf("day");

		return [dateStart, dateEnd];
	}
}