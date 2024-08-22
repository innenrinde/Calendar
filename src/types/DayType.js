import moment from "moment";
import {AbstractType} from "@/types/AbstractType";

/**
 * Calendar view day by day
 */
class DayType extends AbstractType {

	/**
	 * @inheritDoc
	 */
	unit = "day";

	/**
	 * @param {Date} date
	 * @returns {String}
	 */
	title(date) {
		return moment(date).format("DD MMMM YYYY");
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	nextDate(date) {
		return new moment(date).add(1, "days").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {Date}
	 */
	prevDate(date) {
		return new moment(date).subtract(1, "days").toDate();
	}

	/**
	 * @param {Date} date
	 * @returns {[Moment]}
	 */
	interval(date) {
		let dateStart = moment(date).startOf("day");
		let dateEnd = moment(date).endOf("day");

		return [dateStart, dateEnd];
	}

	/**
	 * To add a custom marker between date items
	 * @param {Date} date
	 * @return {null|string}
	 */
	checkStepPeriod(date) {
		let nextDate = this.addUnit(date);
		if (moment(date).weekday() === 6) {
			return "W" + moment(nextDate).week();
		}

		return null;
	}
}

const instance = new DayType();

export { instance as DayType };