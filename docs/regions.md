# `regions([opt])`

Get all operated regions (cities) such as `Berlin` or `Frankfurt`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `regions`s. (_This request may take a few seconds._)
Note that this doesn't fully comply to the the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) yet since the `region` type is only proposed and not already included in the current 'stable' version of FPTF.

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
		type: 'region',
		id: 243,
		name: 'Aachen',
		coordinates: {
			latitude: 50.780919,
			longitude: 6.102988
		},
		country: {
			name: 'Germany',
			code: 'DE'
		},
		class: 'A',
		stations: [
			14698,
			704
		],
		connections: [
			309,
			96,
			111,
			150,
			94,
			109,
			98,
			113
			// …
		],
		slug: 'aachen'
	}
	// …
]
```
