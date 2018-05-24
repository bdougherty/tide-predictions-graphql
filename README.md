# tide-predictions-graphql

> A GraphQL service to find the nearest tide prediction station and get predictions for the next few days.

It provides a simpler and more user-friendly API than the original NOAA API, in addition to geocoding capabilities.

Tide data provided by [NOAA CO-OPS API](https://tidesandcurrents.noaa.gov/api/). Geocoding and reverse geocoding powered by [OpenStreetMap Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim).

## Usage

### With [`now`](https://now.sh)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/bdougherty/tide-predictions-graphql&env=APPLICATION&env=ACCESS_CONTROL_ALLOW_ORIGIN&env=ENABLE_GRAPHIQL)

or

```bash
$ now bdougherty/tide-predictions-graphql
```

### Manual

Deploy to your hosting provider, set the below environment variables, and start it with `npm start`.

## Environment variables

Define the following environment variable:

* `APPLICATION` - [The name of your organization](https://tidesandcurrents.noaa.gov/api/#application)
* `ENABLE_GRAPHIQL` - Define as anything to enable the `/graphiql` endpoint
* `ACCESS_CONTROL_ALLOW_ORIGIN` - The value to send in the `Access-Control-Allow-Origin` header

## Example Queries

* [GraphiQL](https://tide-predictions-graphql.now.sh/graphiql)
* [Closest station with predictions](https://tide-predictions-graphql.now.sh/graphiql?query=query%20(%24location%3A%20Coordinate!)%20%7B%0A%09stations(near%3A%20%24location%2C%20limit%3A%201)%20%7B%0A%09%09name%0A%09%09lat%0A%09%09lon%0A%09%09timeZone%0A%09%09distance(from%3A%20%24location)%0A%09%09predictions%20%7B%0A%09%09%09type%0A%09%09%09height%0A%09%09%09time%0A%09%09%7D%0A%09%7D%0A%7D&variables=%7B%0A%09%22location%22%3A%20%7B%0A%09%09%22lat%22%3A%2039.3426%2C%0A%09%09%22lon%22%3A%20-74.4771%0A%09%7D%0A%7D)
* [Station info](https://tide-predictions-graphql.now.sh/graphiql?query=query%20(%24station%3A%20ID!)%20%7B%0A%20%20station(id%3A%20%24station)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20commonName%0A%20%20%20%20lat%0A%20%20%20%20lon%0A%20%20%20%20timeZone%0A%20%20%20%20url%0A%20%20%20%20tidesUrl%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22station%22%3A%208534836%0A%7D)
* [Geocode](https://tide-predictions-graphql.now.sh/graphiql?query=%7B%0A%20%20geocode(query%3A%20%22ventnor%2C%20nj%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20lat%0A%20%20%20%20lon%0A%20%20%7D%0A%7D)
* [Reverse Geocode](https://tide-predictions-graphql.now.sh/graphiql?query=%7B%0A%20%20reverseGeocode(query%3A%20%7Blat%3A%2039.3405045%2C%20lon%3A%20-74.4773916%7D)%20%7B%0A%20%20%20%20city%0A%20%20%20%20stateCode%0A%20%20%20%20zipCode%0A%20%20%7D%0A%7D)

## License

MIT © [Brad Dougherty](https://brad.is)
