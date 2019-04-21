# `journeys(origin, destination, date, [opt])`

Get directions and prices for routes from A to B. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.

`origin` and `destination` can either be

- `station` ids like `'1'` or `'20'`
- `region` or `station` objects like `{type: 'region', id: '96'}` or `{type: 'station', id: '1'}`

```js
const flix = require('flix')

flix.journeys('20', '1')
flix.journeys('20', {id: '1', type: 'station'})

flix.journeys({id: '95', type: 'region'}, {id: '101', type: 'region'})
```

Please note that `origin` and `destination` must share the same type, you can't combine a `station` origin and a `region` destination or vice-versa.

`date` must be a JS `Date` object.

With `opt`, you can override the default options, which look like this:

```javascript
{
	adults: 1,
	children: 0,
	bikes: 0,
	searchBy: 'regions', // 'stations'
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n' // API key
}
```

## Response

With `origin = {type: 'region', id: '88'}` and `destination = {type: 'region', id: '96'}`, the returned `Promise` will resolve like this:

```js
[
	{
	    type: "journey",
	    id: "interconnection-0-1-12-54079638-89-56551737",
	    legs: [
	        {
	            origin: {
	                type: "station",
	                id: "1",
	                name: "Berlin central bus station",
	                importance: 100
	            },
	            destination: {
	                type: "station",
	                id: "89",
	                name: "Bremen",
	                importance: null
	            },
	            departure: "2018-03-23T00:50:00+01:00",
	            arrival: "2018-03-23T05:55:00+01:00",
	            hint: null,
	            operator: {
	                type: "operator",
	                id: "mfb",
	                name: "FlixBus DACH GmbH",
	                url: "http://flixbus.de",
	                address: "Karl-Liebknecht-Straße 33, D-10178 Berlin"
	            },
	            schedule: "1-2018-03-23t00-50-00-01-00-89-2018-03-23t05-55-00-01-00",
	            mode: "bus",
	            public: true
	        },
	        {
	            origin: {
	                type: "station",
	                id: "89",
	                name: "Bremen",
	                importance: null
	            },
	            destination: {
	                type: "station",
	                id: "12",
	                name: "Frankfurt central station",
	                importance: 100
	            },
	            departure: "2018-03-23T06:55:00+01:00",
	            arrival: "2018-03-23T13:20:00+01:00",
	            hint: null,
	            operator: {
	                type: "operator",
	                id: "mfb",
	                name: "FlixBus DACH GmbH",
	                url: "http://flixbus.de",
	                address: "Karl-Liebknecht-Straße 33, D-10178 Berlin"
	            },
	            schedule: "89-2018-03-23t06-55-00-01-00-12-2018-03-23t13-20-00-01-00",
	            mode: "bus",
	            public: true
	        }
	    ],
	    status: "available",
	    borders: false, // international connection / crossed borders?
	    price: {
	        amount: 72.4,
	        currency: "EUR",
	        discounts: null,
	        saleRestriction: false,
	        available: true,
	        url: "https://shop.flixbus.com/s?departureCity=88&arrivalCity=96&departureStation=1&arrivalStation=12&rideDate=23.03.2018&currency=EUR&adult=1&children=0&bike_slot=0"
	    },
	    info: {
	        title: "",
	        hint: "",
	        message: "",
	        warnings: []
	    }
	}
	// …
]
```
