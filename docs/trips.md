# `trips(from, to, date, [opt])`

`from` and `to` must be city ids like `88` (or station ids, if you change the `search_by` options).
`date` must be a `Date` object.

With `opt`, you can override the default options, which look like this:

```javascript
{
	adults: 1,
	children: 0,
	bikes: 0,
	currency: 'EUR', // EUR, GBP, CHF, CZK, DKK, HRK, HUF, NOK, PLN, SEK, BGN, RON
	search_by: 'cities',
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n' // API key
}
```

## Response

With `from = 88` and `to = 243`, the returned `Promise` will resolve like this:

```js
[ {
	from: {
		id: 1,
		name: 'Berlin central bus station',
		importance_order: 100
	},
	to: {
		id: 704,
		name: 'Aachen',
		importance_order: 0
	},
	id: 24793578,
	rides: { '24793578': '' },
	type: 'direct',
	departure: …, // Moment object
	arrival: …, // Moment object
	duration: 585, // in minutes
	status: 'available',
	borders: false,
	available: {
		seats: 999,
		slots: 999
	},
	operators: 
	[ { 
		label: 'FlixMobility GmbH',
		key: 'flix',
		url: 'http://shop.flixbus.de',
		address: 'Birketweg 33, D-80639 München'
	} ],
	transfers: null,
	sale_restriction: false,
	discounts: null,
	price: 59.5,
	info: {
		title: '',
		hint: '',
		message: ''
	},
	warnings: []
}, …]
```
