<template>
<div
	class="events"
	:class="{ 'show-icon': !isDayType }"
>
	<label
		class="day"
		@click="sendCurrentDate"
	>
		<span>{{ day.number }}</span>
		<font-awesome-icon :icon="['fas', 'up-right-and-down-left-from-center']" />
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
					@click="openEvent(event)"
				>
					{{ title.title }}
				</label>
			</div>
		</div>

	</div>
</div>
</template>

<script>

import {Day} from "@/calendar/models/DayModel";

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
		},
		isDayType: {
			type: Boolean,
			default: () => false
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
		},
		/**
		 * Click on an event
		 * @param {Object} event
		 */
		openEvent(event) {
			this.$emit("event", { day: this.day, ...event });
		}
	}
};

</script>