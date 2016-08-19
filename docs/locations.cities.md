# `locations.cities([opt])`

This will return a `Promise` which resolves in a list of all operated cities. (_This request may take a few seconds._)

With `opt`, you can override the default options, which look like this:

```javascript
{
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n' // API key
}
```

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
