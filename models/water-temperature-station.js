import geoTz from 'geo-tz';
import * as tc from 'timezonecomplete';

export class WaterTemperatureStation {
	constructor(data) {
		this.data = data;
	}

	get id() {
		return null;
	}

	get name() {
		return '';
	}

	get url() {
		return '';
	}

	get lat() {
		return 0;
	}

	get lon() {
		return 0;
	}

	get time() {
		return 0;
	}

	get temperature() {
		return null;
	}
}

export class USGSWaterTemperatureStation extends WaterTemperatureStation {
	get service() {
		return 'USGS';
	}

	get id() {
		return `USGS:${this.data.sourceInfo.siteCode[0].value}`;
	}

	get name() {
		return this.data.sourceInfo.siteName;
	}

	get url() {
		return `https://waterdata.usgs.gov/nwis/uv?site_no=${this.data.sourceInfo.siteCode[0].value}`;
	}

	get lat() {
		return parseFloat(this.data.sourceInfo.geoLocation.geogLocation.latitude);
	}

	get lon() {
		return parseFloat(this.data.sourceInfo.geoLocation.geogLocation.longitude);
	}

	get time() {
		const zoneName = geoTz(this.lat, this.lon);
		const zone = tc.zone(zoneName);

		return new tc.DateTime(this.data.values[0].value[0].dateTime, zone);
	}

	get temperature() {
		const { noDataValue } = this.data.variable;
		const temperatureInCelsius = parseFloat(this.data.values[0].value[0].value);

		if (noDataValue === temperatureInCelsius) {
			return null;
		}

		return temperatureInCelsius;
	}
}

export class NOAAWaterTemperatureStation extends WaterTemperatureStation {
	get service() {
		return 'NOAA';
	}

	get id() {
		return `NOAA:${this.data.metadata.id}`;
	}

	get name() {
		return this.data.metadata.name;
	}

	get url() {
		return `https://tidesandcurrents.noaa.gov/stationhome.html?id=${this.data.metadata.id}#wttext`;
	}

	get lat() {
		return parseFloat(this.data.metadata.lat);
	}

	get lon() {
		return parseFloat(this.data.metadata.lon);
	}

	get time() {
		const zoneName = geoTz(this.lat, this.lon);
		const zone = tc.zone(zoneName);

		return new tc.DateTime(this.data.data[0].t, 'yyyy-MM-dd HH:mm', zone);
	}

	get temperature() {
		return parseFloat(this.data.data[0].v);
	}
}
