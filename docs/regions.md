# `regions([opt])`

Get all operated regions (cities) such as `Berlin` or `Frankfurt`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `region`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). (_This request may take a few seconds._)

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
	    type: "region",
	    id: "243",
	    name: "Aachen",
	    location: {
	        type: "location",
	        longitude: 6.102988,
	        latitude: 50.780919,
	        country: {
	            name: "Germany",
	            code: "DE"
	        }
	    },
	    class: "A",
	    stations: [
	        "14698",
	        "704"
	    ],
	    connections: [
	        88,
	        89,
	        90,
	        91,
	        92,
	        // …
	    ],
	    slug: "aachen"
	}
	// …
]
```
