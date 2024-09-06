<template>

	<label
		class="day"
		@click="sendCurrentDate"
	>
		{{ day.number }}
	</label>

	<div
		ref="container"
		class="events-list"
	>

		<div
			v-for="event in groupedEventsList()"
			:key="event"
			class="event"
		>
			<label class="hour">
				{{ hours(event.hourStart) }}<sup>{{ minutes(event.hourStart) }}</sup>
			</label>
			<label>-</label>
			<label class="hour">
				{{ hours(event.hourEnd) }}<sup>{{ minutes(event.hourEnd) }}</sup>
			</label>
			<div class="titles-list">
				<label
					v-for="title in event.events"
					:key="title"
					class="title"
				>
					{{ title.title }}
				</label>
			</div>
		</div>

	</div>

</template>

<script>

import {Day} from "@/models/DayModel";

export default {
	name: "UIEvents",
	props: {
		day: {
			type: Day,
			default: () => {},
		},
		events: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			eventsList: [],
			stopAddingEvent: false,
		};
	},
	methods: {
		/**
		 * Group events by hours
		 */
		groupedEventsList() {
			return Object.values(this.events.reduce((acc, event) => {

				let key = `${event.hourStart}-${event.hourEnd}`;

				if (!acc[key]) {
					acc[key] = {
						hourStart: event.hourStart,
						hourEnd: event.hourEnd,
						events: []
					};
				}

				acc[key].events.push(event);

				return acc;

			}, {}));

		},
		/**
		 * Extract hours from a date time
		 * @param {String} label
		 * @return {String}
		 */
		hours(label) {
			return label.split(":").at(0);
		},
		/**
		 * Extract minutes from a date time
		 * @param {String} label
		 * @return {String}
		 */
		minutes(label) {
			return label.split(":").at(1);
		},
		/**
		 * Click on date label - emit current date
		 */
		sendCurrentDate() {
			this.$emit("setCurrentDate", this.day);
		}
	}
};

</script>

<style scoped>
.day {
	text-align: left;
	padding: 2px;
	cursor: pointer;
}

.day:hover {
	background-color: #efefef;
}

.events-list {
	display: flex;
	flex-direction: column;
	overflow: auto;
}

.event {
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #e0f1ff;
	margin: 1px;
	padding: 1px;
}

.event label {
	margin-bottom: 1px;
}

.event .hour {
	width: 40px;
	font-size: 10px;
}

.event .titles-list {
	width: 100%;
	display: flex;
	flex-direction: column;
}

.event .title {
	border: dashed 1px #5188c4;
	width: 100%;
	text-align: left;
}

.event .title:hover {
	background-color: #5188c4;
	color: #fff;
	cursor: pointer;
}
</style>