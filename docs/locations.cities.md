# `locations.cities()`

This will return a `Promise` which resolves in a list of all operated cities.

## Response

```js
[ {
	id: 243,
	name: 'Aachen',
	coordinates: {
		latitude: 50.782292,
		longitude: 6.071503
	},
	country: {
		name: 'Germany',
		code: 'DE'
	},
	class: 'A',
	stations: [ 704 ], // list of station IDs in this city
	connections: [88, 89, 90, …], // list of connected locations
	slug: 'aachen'
}, …]
```
