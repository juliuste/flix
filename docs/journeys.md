# `journeys(origin, destination, date, [opt])`

Get directions and prices for routes from A to B. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.
*Note that the results are not fully spec-compatible, as all dates are represented by JS `Date()` objects instead of ISO strings and the `schedule` is missing in legs.*

`origin` and `destination` must be `region` ids like `88` (or `station` ids, if you change the `search_by` options).
`date` must be a `Date` object.

With `opt`, you can override the default options, which look like this:

```javascript
{
	adults: 1,
	children: 0,
	bikes: 0,
	search_by: 'regions', // 'stations'
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n' // API key
}
```

## Response

With `origin = 88` and `to = 96`, the returned `Promise` will resolve like this:

```js
[
	{
		type: 'journey',
		origin: {
			type: 'station',
			id: 1,
			name: 'Berlin central bus station',
			importance: 100
		},
		destination: {
			type: 'station',
			id: 12,
			name: 'Frankfurt Hbf',
			importance: 100
		},
		id: 0,
		direct: false,
		rides: [],
		departure: '2017-07-17T18:00:00.000Z', // JS Date() object
		arrival: '2017-07-18T03:05:00.000Z', // JS Date() object
		legs: [
			{
				origin: {
					type: 'station',
					id: 1,
					name: 'Berlin central bus station',
					importance: 100
				},
				destination: {
					type: 'station',
					id: 64,
					name: 'Hannover',
					importance: null
				},
				departure: '2017-07-17T18:00:00.000Z', // JS Date() object
				arrival: '2017-07-17T21:15:00.000Z', // JS Date() object
				operator: {
					type: 'operator',
					id: 'mfb',
					name: 'FlixBus DACH GmbH',
					url: 'http://flixbus.de',
					address: 'Karl-Liebknecht-Straße 33, D-10178 Berlin'
				}
			},
			{
				origin: {
					type: 'station',
					id: 64,
					name: 'Hannover',
					importance: null
				},
				destination: {
					type: 'station',
					id: 12,
					name: 'Frankfurt Hbf',
					importance: 100
				},
				departure: '2017-07-17T22:45:00.000Z', // JS Date() object
				arrival: '2017-07-18T03:05:00.000Z', // JS Date() object
				operator: {
					type: 'operator',
					id: 'mfb',
					name: 'FlixBus DACH GmbH',
					url: 'http://flixbus.de',
					address: 'Karl-Liebknecht-Straße 33, D-10178 Berlin'
				}
			}
		],
		status: 'available',
		borders: false,
		available: {
			seats: 999,
			slots: 999
		},
		operators: [
			{
				type: 'operator',
				id: 'mfb',
				name: 'FlixBus DACH GmbH',
				url: 'http://flixbus.de',
				address: 'Karl-Liebknecht-Straße 33, D-10178 Berlin'
			}
		],
		price: {
			amount: 45.8,
			currency: 'EUR',
			discounts: null,
			sale_restriction: false,
			available: true
		},
		info: {
			title: '',
			hint: '',
			message: ''
		},
		warnings: []
	}
	// …
]
```
