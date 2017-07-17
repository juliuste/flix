# `locations.stations([opt])`

Get all operated stations (not including cities). Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). (_This request may take a few seconds._)

With `opt`, you can override the default options, which look like this:

```javascript
{
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n' // API key
}
```

## Response

```js
[
	{
		type: 'station',
		subtype: 'station',
		id: 14698,
		name: 'Aachen Hüls',
		street: 'Wilmersdorfer Straße',
		zip: '52068',
		address: 'Wilmersdorfer Straße, 52068 Aachen, Germany',
		coordinates: {
			latitude: 50.785761869444,
			longitude: 6.1371751064882
		},
		slug: 'aachen-huls-wilmersdorfer-strasse',
		aliases: [],
		city: 243,
		connections: [
			11548,
			501,
			38,
			12,
			11417,
			2875,
			2865,
			4168,
			6198,
			8038
			// …
		],
		importance: 0,
		country: {
			name: 'Germany',
			code: 'DE'
		}
	}
	// …
]
```
