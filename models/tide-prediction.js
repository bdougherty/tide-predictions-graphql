export class TidePrediction {
	constructor(data) {
		this.data = data;
	}

	get type() {
		return this.data.type;
	}

	get height() {
		return parseFloat(this.data.height);
	}

	get time() {
		return this.data.time;
	}
}
