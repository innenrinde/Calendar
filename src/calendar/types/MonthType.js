import {AbstractType} from "@/calendar/types/AbstractType";
import moment from "moment";

/**
 * Calendar view month by month
 */
class MonthType extends AbstractType {

	/**
	 * @inheritDoc
	 */
	unit = "month";

	/**
	 * @inheritDoc
	 */
	title(date, format = "MMMM YYYY") {
		return moment(date)
			.startOf("month")
			.format(format)
			.ucfirst();
	}

	/**
	 * @inheritDoc
	 */
	periodTitle(date) {
		return moment(date)
			.startOf("month")
			.format("MMMM")
			.ucfirst();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	nextDate(date) {
		return new moment(date).add(1, "months").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	prevDate(date) {
		return new moment(date).subtract(1, "months").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {[Moment]}
	 */
	interval(date) {
		let dateStart = moment(date).startOf("month").startOf("week");
		let dateEnd = moment(date).endOf("month").endOf("week");

		return [dateStart, dateEnd];
	}
}

const instance = new MonthType();

export { instance as MonthType };
