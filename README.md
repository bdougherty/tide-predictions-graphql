# tide-predictions-graphql

> A GraphQL microservice to find the nearest tide prediction station and get predictions for the next few days

It provides a simpler and more user-friendly API than the original NOAA API.

Tide data provided by [NOAA CO-OPS API](https://tidesandcurrents.noaa.gov/api/).


## Usage

### With [`now`](https://now.sh)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/bdougherty/tide-predictions-graphql&env=APPLICATION)

or

```bash
$ now bdougherty/tide-predictions-graphql -e APPLICATION=xxx
```

### Manual

Deploy to your hosting provider, set the below environment variables, and start it with `npm start`.

## Environment variables

Define the following environment variable:

* `APPLICATION` - [The name of your organization](https://tidesandcurrents.noaa.gov/api/#application)

## Example Queries

* [GraphiQL](https://tide-data-graphql-ovmgiysmlr.now.sh/graphiql)
* [Closest station with predictions](https://tide-data-graphql-ovmgiysmlr.now.sh/graphiql?query=query%20(%24location%3A%20Coordinate!)%20%7B%0A%09stations(near%3A%20%24location%2C%20limit%3A%201)%20%7B%0A%09%09name%0A%09%09lat%0A%09%09lon%0A%09%09timeZone%0A%09%09distance(from%3A%20%24location)%0A%09%09predictions%20%7B%0A%09%09%09type%0A%09%09%09height%0A%09%09%09time%0A%09%09%7D%0A%09%7D%0A%7D&variables=%7B%0A%09%22location%22%3A%20%7B%0A%09%09%22lat%22%3A%2039.3426%2C%0A%09%09%22lon%22%3A%20-74.4771%0A%09%7D%0A%7D)
* [Station info](https://tide-data-graphql-ovmgiysmlr.now.sh/graphiql?query=query%20(%24station%3A%20ID!)%20%7B%0A%20%20station(id%3A%20%24station)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20commonName%0A%20%20%20%20lat%0A%20%20%20%20lon%0A%20%20%20%20timeZone%0A%20%20%20%20url%0A%20%20%20%20tidesUrl%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22station%22%3A%208534836%0A%7D)

## License

MIT © [Brad Dougherty](https://brad.is)
