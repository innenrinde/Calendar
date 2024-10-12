<template>
	<div class="popup">
		<div class="shadow"></div>
		<div class="container">

			<div class="content">
				<div class="dates">
					<label>When:</label>
					<label>{{ dateLabel }}</label>
				</div>
				<div class="dates">
					<label>Hour start:</label>
					<label>{{ event.hourStart }}</label>
				</div>
				<div class="dates">
					<label>Hour end:</label>
					<label>{{ event.hourEnd }}</label>
				</div>

				<div
					v-for="event of event.events"
					:key="event"
				>
					<div class="event">
						<label>{{ event.title }}</label>
						<label>{{ event.description }}</label>
					</div>
				</div>
			</div>

			<div>
				<button @click="closeEvent">
					<font-awesome-icon :icon="['fas', 'xmark']" />
					Close
				</button>
			</div>

		</div>
	</div>
</template>

<script>

export default {
	name: "UIPopup",
	props: {
		event: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		/**
		 * Formatted date with week day
		 * @return {String}
		 */
		dateLabel() {
			return this.moment(this.event.day.date).format("dddd, MMMM Do, YYYY").ucfirst();
		}
	},
	methods: {
		/**
		 * Close popup
		 */
		closeEvent() {
			this.$emit("close");
		}
	}
};

</script>