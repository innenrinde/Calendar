import moment from "moment";

export class MonthType {

	/**
	 * @param {Date} date
	 * @returns {string}
	 */
	static title(date) {
		return moment(date)
			.startOf("month")
			.format("MMMM YYYY");
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static nextDate(date) {
		return new moment(date).add(1, "months").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static prevDate(date) {
		return new moment(date).subtract(1, "months").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {moment.Moment[]}
	 */
	static interval(date) {
		let dateStart = moment(date).startOf("month").startOf("week");
		let dateEnd = moment(date).endOf("month").endOf("week");

		return [dateStart, dateEnd];
	}
}