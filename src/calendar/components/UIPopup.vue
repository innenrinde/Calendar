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

<style scoped>
.popup {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	z-index: 9999;
}

.popup .container {
	position: fixed;
	display: flex;
	flex-direction: column;
	top: 50%;
	left: 50%;
	height: 400px;
	width: 400px;
	padding: 20px;
	margin-left: -200px;
	margin-top: -200px;
	background-color: #fff;
	border: solid 1px #000;
	text-align: center;
}

.popup .container sup {
	font-size: 12px;
}

.popup .container .content {
	height: 100%;
	overflow: auto;
}

.popup .shadow {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #1f1d1d;
	opacity: 0.4;
}

.dates {
	text-align: left;
	margin-bottom: 5px;
}

.dates label:first-child {
	background-color: #cae7f8;
	padding: 5px;
	border-radius: 10px;
	width: 80px;
	display: inline-block;
}

.dates label:last-child {
	font-weight: bold;
	padding: 5px;
}

.event label:first-child {
	text-align: left;
	background-color: #cae7f8;
	padding: 5px;
	margin-top: 10px;
	border-radius: 10px;
	border: dashed 1px #5188c4;
	display: block;
}

.event label:last-child {
	text-align: left;
	padding: 5px 5px 0 5px;
	margin-left: 10px;
	display: block;
	border-left: solid 3px #cae7f8;
}

button {
	padding: 5px;
	margin-right: 4px;
	border: solid 1px #a1a1a1;
	background-color: #f1f1f1;
	border-radius: 3px;
	cursor: pointer;
	font-size: 12px;
}

button:hover {
	background-color: #c9c9c9;
}

</style>