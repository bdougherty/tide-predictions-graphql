class Prediction {
	constructor(data) {
		this.data = data;
	}

	get height() {
		return parseFloat(this.data.height);
	}

	get time() {
		return this.data.time;
	}
}

export class TidePrediction extends Prediction {
	get type() {
		return this.data.type;
	}
}

export class WaterLevelPrediction extends Prediction {}
