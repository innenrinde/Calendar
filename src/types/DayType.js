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
	 * @inheritDoc
	 */
	title(date) {
		return moment(date).format("DD MMMM YYYY");
	}

	/**
	 * @inheritDoc
	 */
	periodTitle(date) {
		return moment(date).format("DD MMMM");
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
	 * @inheritDoc
	 */
	markerLabel(date) {
		return moment(date).format("YYYY") + " - W" + moment(date).week();
	}

	/**
	 * @inheritDoc
	 */
	marker(date) {
		return moment(date).week();
	}
}

const instance = new DayType();

export { instance as DayType };