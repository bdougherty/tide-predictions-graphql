import stateNamesToAbbreviations from 'datasets-us-states-names-abbr';

export class Location {
	constructor(data) {
		this.data = data;
	}

	get lat() {
		return 0;
	}

	get lon() {
		return 0;
	}

	get name() {
		const abbreviation = this.stateCode || this.state;
		const country = this.countryCode.toLowerCase() === 'us' ? '' : `, ${this.country}`;
		const locality = `${this.city}, ${abbreviation}${country}`;

		if (this.streetNumber) {
			return `${this.streetNumber} ${this.streetName}, ${locality}`.trim();
		}

		return locality.trim();
	}

	get streetNumber() {
		return null;
	}

	get streetName() {
		return null;
	}

	get city() {
		return '';
	}

	get state() {
		return '';
	}

	get stateCode() {
		return '';
	}

	get postalCode() {
		return '';
	}

	get country() {
		return '';
	}

	get countryCode() {
		return '';
	}
}

export class GeonamesLocation extends Location {
	get lat() {
		return parseFloat(this.data.lat);
	}

	get lon() {
		return parseFloat(this.data.lng);
	}

	get streetNumber() {
		return this.data.houseNumber || null;
	}

	get streetName() {
		return this.data.street || null;
	}

	get city() {
		return this.data.locality;
	}

	get state() {
		return this.data.adminName1;
	}

	get stateCode() {
		return this.data.adminCode1;
	}

	get postalCode() {
		return this.data.postalcode;
	}

	get country() {
		return '';
	}

	get countryCode() {
		return this.data.countryCode;
	}
}

export class OpenStreetMapLocation extends Location {
	get lat() {
		return parseFloat(this.data.lat);
	}

	get lon() {
		return parseFloat(this.data.lon);
	}

	get name() {
		if (!this.city) {
			return this.data.display_name;
		}

		return super.name;
	}

	get streetNumber() {
		return this.data.address.house_number;
	}

	get streetName() {
		return this.data.address.road;
	}

	get city() {
		if (this.data.type in this.data.address) {
			return this.data.address[this.data.type];
		}

		return this.data.address.city || this.data.address.town || this.data.address.village;
	}

	get state() {
		return this.data.address.state;
	}

	get stateCode() {
		return stateNamesToAbbreviations[this.data.address.state];
	}

	get postalCode() {
		return this.data.address.postcode;
	}

	get country() {
		return this.data.address.country;
	}

	get countryCode() {
		return this.data.address.country_code.toUpperCase();
	}
}

export class IPAPILocation extends Location {
	get lat() {
		return parseFloat(this.data.lat);
	}

	get lon() {
		return parseFloat(this.data.lon);
	}

	get city() {
		return this.data.city;
	}

	get state() {
		return this.data.regionName;
	}

	get stateCode() {
		return this.data.region;
	}

	get postalCode() {
		return this.data.zip;
	}

	get country() {
		return this.data.country;
	}

	get countryCode() {
		return this.data.countryCode;
	}
}

export class IPDataLocation extends Location {
	get lat() {
		return this.data.latitude;
	}

	get lon() {
		return this.data.longitude;
	}

	get city() {
		return this.data.city;
	}

	get state() {
		return this.data.region;
	}

	get stateCode() {
		return this.data.region_code;
	}

	get postalCode() {
		return this.data.postal;
	}

	get country() {
		return this.data.country_name;
	}

	get countryCode() {
		return this.data.country_code;
	}
}

export class IPStackLocation extends Location {
	get lat() {
		return this.data.latitude;
	}

	get lon() {
		return this.data.longitude;
	}

	get city() {
		return this.data.city;
	}

	get state() {
		return this.data.region_name;
	}

	get stateCode() {
		return this.data.region_code;
	}

	get postalCode() {
		return this.data.zip;
	}

	get country() {
		return this.data.country_name;
	}

	get countryCode() {
		return this.data.country_code;
	}
}
