# tide-predictions-graphql

> A GraphQL service to find the nearest tide prediction station and get predictions for the next few days.

It provides a simpler and more user-friendly API than the original NOAA API, in addition to geocoding capabilities.

Tide data powered by [NOAA CO-OPS API](https://tidesandcurrents.noaa.gov/api/). Water temperature data powered by [USGS Instantaneous Values Web Service](https://waterservices.usgs.gov/rest/IV-Service.html). Weather data powered by [Dark Sky](https://darksky.net/dev/docs). Geocoding and reverse geocoding powered by [OpenStreetMap Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim).

## Usage

Deploy to your hosting provider, set the below environment variables, and start it with `npm start`.

## Environment variables

Define the following environment variable:

* `APPLICATION` - [The name of your organization](https://tidesandcurrents.noaa.gov/api/#application)
* `ENABLE_GRAPHIQL` - Set to `"true"` to enable the `/graphiql` endpoint
* `ACCESS_CONTROL_ALLOW_ORIGIN` - The value to send in the `Access-Control-Allow-Origin` header
* `GEONAMES_USERNAME` - https://geonames.org API username
* `IPDATA_API_KEY` - API key for https://ipdata.co/
* `IPSTACK_API_KEY` - API key for https://ipstack.com/
* `SENTRY_DSN` - To enable reporting to Sentry (optional)
* `APOLLO_ENGINE` - Apollo Engine API key (optional)

## License

MIT © [Brad Dougherty](https://brad.is)
