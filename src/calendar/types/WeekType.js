import moment from "moment";
import {AbstractType} from "@/calendar/types/AbstractType";

/**
 * Calendar view week by week
 */
class WeekType extends AbstractType {

	/**
	 * @inheritDoc
	 */
	unit = "week";

	/**
	 * @inheritDoc
	 */
	title(date) {
		let dateStart = moment(date)
			.startOf("week")
			.format("DD MMMM YYYY");

		let dateEnd = moment(date)
			.endOf("week")
			.format("DD MMMM YYYY");

		return `${dateStart} - ${dateEnd}`;
	}

	/**
	 * @inheritDoc
	 */
	periodTitle(date) {
		let dateStart = moment(date)
			.startOf("week")
			.format("DD MMMM");

		let dateEnd = moment(date)
			.endOf("week")
			.format("DD MMMM");

		return `${dateStart} - ${dateEnd}`;
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	nextDate(date) {
		return new moment(date).add(1, "week").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	prevDate(date) {
		return new moment(date).subtract(1, "week").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {[Moment]}
	 */
	interval(date) {
		let dateStart = moment(date).startOf("week");
		let dateEnd = moment(date).endOf("week");

		return [dateStart, dateEnd];
	}
}

const instance = new WeekType();

export { instance as WeekType };