# `stations([opt])`

Get all operated stations such as `Berlin central bus station` or `Frankfurt Hbf`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). (_This request may take a few seconds._)

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
	    type: "station",
	    id: "14698",
	    name: "Aachen Hüls",
	    location: {
	        type: "location",
	        longitude: 6.1371751064882,
	        latitude: 50.785761869444,
	        address: "Wilmersdorfer Straße, 52068 Aachen, Germany",
	        country: {
	            name: "Germany",
	            code: "DE"
	        },
	        zip: "52068",
	        street: "Wilmersdorfer Straße"
	    },
	    slug: "aachen-huls-wilmersdorfer-strasse",
	    aliases: [],
	    regions: [
	        "243"
	    ],
	    connections: [
	        1,
	        2,
	        3,
	        4,
	        5,
	        // …
	    ],
	    importance: 0
	}
	// …
]
```
