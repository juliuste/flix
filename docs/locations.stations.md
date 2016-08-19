# `locations.stations()`

This will return a `Promise` which resolves in a list of all operated stations. (_This request may take a few seconds._)

## Response

```js
[ {
	id: 704,
	name: 'Aachen',
	street: 'Kühlwetterstraße 18',
	zip: '52072',
	address: 'Kühlwetterstraße 18, 52072 Aachen, Germany',
	coordinates: {
		latitude: 50.782292,
		longitude: 6.071503
	},
	slug: 'aachen',
	aliases: [], // list of city name aliases (if existing)
	city: 243,
	connections: [1, 2, 3, …], // list of connected locations
	importance: 0,
	country: {
		name: 'Germany',
		code: 'DE'
	}
}, …]
```