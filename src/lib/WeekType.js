import moment from "moment";

export class WeekType {

	/**
	 * @param {Date} date
	 * @returns {string}
	 */
	static title(date) {
		let dateStart = moment(date)
			.startOf("week")
			.format("DD MMMM YYYY");

		let dateEnd = moment(date)
			.endOf("week")
			.format("DD MMMM YYYY");

		return `${dateStart} - ${dateEnd}`;
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static nextDate(date) {
		return new moment(date).add(1, "week").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	static prevDate(date) {
		return new moment(date).subtract(1, "week").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {moment.Moment[]}
	 */
	static interval(date) {
		let dateStart = moment(date).startOf("week");
		let dateEnd = moment(date).endOf("week");

		return [dateStart, dateEnd];
	}
}