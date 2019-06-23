# flix

JavaScript client for the [FlixBus (Meinfernbus) / FlixTrain](https://www.flixbus.de/) API. Inofficial, using endpoints by *FlixMobility*. [Ask them for permission](https://www.flixbus.com/company/partners/affiliate-partners) before using this module in production.

This module conforms to the [FPTI-JS `0.3.2` standard](https://github.com/public-transport/fpti-js/tree/0.3.2) for JavaScript public transportation modules.

[![npm version](https://img.shields.io/npm/v/flix.svg)](https://www.npmjs.com/package/flix)
[![Build Status](https://travis-ci.org/juliuste/flix.svg?branch=master)](https://travis-ci.org/juliuste/flix)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/flix.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/juliuste/flix.svg?style=flat)](LICENSE)
[![fpti-js version](https://fpti-js.badges.juliustens.eu/badge/juliuste/flix)](https://fpti-js.badges.juliustens.eu/link/juliuste/flix)
[![chat on gitter](https://badges.gitter.im/public-transport.svg)](https://gitter.im/public-transport)

## Installation

```shell
npm install flix
```

## Usage

```javascript
const flix = require('flix')
```

The `flix` module conforms to the [FPTI-JS `0.3.2` standard](https://github.com/public-transport/fpti-js/tree/0.3.2) for JavaScript public transportation modules and exposes the following methods:

Method | Feature description | [FPTI-JS `0.3.2`](https://github.com/public-transport/fpti-js/tree/0.3.2)
-------|---------------------|--------------------------------------------------------------------
[`stations.all([opt])`](#stationsallopt) | All stations of the *Flix* network, such as `Berlin central bus station` or `Frankfurt Hbf` | [✅ yes](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/stations-stops-regions.all.md)
[`regions.all([opt])`](#regionsallopt) | All regions (cities) of the *Flix* network, such as `Berlin` or `Frankfurt` | [✅ yes](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/stations-stops-regions.all.md)
[`journeys(origin, destination, [opt])`](#journeysorigin-destination-opt) | Journeys between stations or regions | [✅ yes](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/journeys.md)

---

### `stations.all([opt])`

Get **all** stations of the *Flix* network, such as `Berlin central bus station` or `Frankfurt Hbf`. See [this method in the FPTI-JS `0.3.2` spec](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/stations-stops-regions.all.md).

#### Supported Options

Attribute | Description | FPTI-spec | Value type | Default
----------|-------------|------------|------------|--------
`apiKey` | Custom Flix API key | ❌ | `String` | *default api key*

#### Example

```js
const flix = require('flix')
const stationStream = flix.stations.all()

stationStream.on('data', item => {
    // item is an FPTF station object
    console.log(item)
})
```

```js
{
    type: "station",
    id: "1",
    name: "Berlin central bus station",
    location: {
        type: "location",
        longitude: 13.279399,
        latitude: 52.507171,
        address: "Masurenallee 4-6, 14057 Berlin, Germany",
        country: {
            name: "Germany",
            code: "DE"
        },
        zip: "14057",
        street: "Masurenallee 4-6"
    },
    slug: "berlin-zob",
    aliases: [],
    regions: [
        "88"
    ],
    connections: [
        2,
        3,
        4,
        5,
        8,
        9
        // …
    ],
    importance: 100
}
```

---

### `regions.all([opt])`

Get **all** regions of the *Flix* network, such as `Berlin` or `Frankfurt`. See [this method in the FPTI-JS `0.3.2` spec](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/stations-stops-regions.all.md).

#### Supported Options

Attribute | Description | FPTI-spec | Value type | Default
----------|-------------|------------|------------|--------
`apiKey` | Custom Flix API key | ❌ | `String` | *default api key*

#### Example

```js
const flix = require('flix')
const regionStream = flix.regions.all()

regionStream.on('data', item => {
    // item is an FPTF region object
    console.log(item)
})
```

```js
{
    type: "region",
    id: "88",
    name: "Berlin",
    location: {
        type: "location",
        longitude: 13.404616,
        latitude: 52.486081,
        country: {
            name: "Germany",
            code: "DE"
        }
    },
    class: "A",
    stations: [
        "1",
        "20688",
        "1224",
        "20678",
        "481"
        // …
    ],
    connections: [
        89,
        90,
        91,
        92,
        93,
        94,
        96,
        97,
        98
        // …
    ],
    slug: "berlin"
}
```

---

### `journeys(origin, destination, [opt])`

Find journeys between stations or regions. See [this method in the FPTI-JS `0.3.2` spec](https://github.com/public-transport/fpti-js/blob/0.3.2/docs/journeys.md). Note that origin and destination must have the same type (so either both `region` or both `station`).

#### Supported Options

Attribute | Description | FPTI-spec | Value type | Default
----------|-------------|------------|------------|--------
`when` | Journey date, synonym to `departureAfter` | ✅ | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/date) | `new Date()`
`departureAfter` | List journeys with a departure (first leg) after this date | ✅ | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/date) | `new Date()`
`results` | Max. number of results returned | ✅ | `Number` | `null`
`interval` | Results for how many minutes after `when`/`departureAfter` | ✅ | `Number` | `null`
`transfers` | Max. number of transfers | ✅ | `Number` | `null`
`currency` | Currency for `journey.price` | ✅ | [ISO 4217 code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | `EUR`
`language` | Language of the results | ❌ | [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) | `en`
`adults` | Number of traveling adults | ❌ | `Number` | `1`
`children` | Number of traveling children | ❌ | `Number` | `0`
`bicycles` | Number of traveling bicycles | ❌ | `Number` | `0`
`apiKey` | Custom Flix API key | ❌ | `String` | *default api key*

Note that, unless `opt.interval` is specified, the module will return journeys that start after `when`/`departureAfter`, but before the beginning of the following calendar day.

#### Example

```js
// journeys between stations
const berlinZOB = '1' // station id
const hamburgCentral = { // FPTF station
	type: 'station',
	id: '36'
	// …
}
interrail.journeys(berlinZOB, hamburgCentral, { when: new Date('2019-06-27T05:00:00+0200'), currency: 'PLN' }).then(…)

// journeys between regions
const berlin = { // FPTF region
    type: 'region',
    id: '88'
    // …
}
const hamburg = { // FPTF region
	type: 'region',
	id: '118'
	// …
}
interrail.journeys(berlin, hamburg, { when: new Date('2019-06-27T05:00:00+0200'), transfers: 0 }).then(…)
```

```js
{
    type: "journey",
    id: "direct-80979121-1-36",
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
                id: "36",
                name: "Hamburg ZOB",
                importance: 100
            },
            departure: "2019-06-27T06:45:00+02:00",
            arrival: "2019-06-27T10:00:00+02:00",
            operator: {
                type: "operator",
                id: "mfb",
                name: "FlixBus DACH GmbH",
                url: "http://flixbus.de",
                address: "Karl-Liebknecht-Straße 33, D-10178 Berlin"
            },
            mode: "bus",
            public: true
        }
    ],
    status: "available",
    borders: false,
    info: {
        title: null,
        hint: null,
        message: null,
        warnings: []
    },
    price: {
        amount: 9.99,
        currency: "EUR",
        discounts: null,
        saleRestriction: false,
        available: true,
        url: "https://shop.global.flixbus.com/s?departureCity=88&arrivalCity=118&departureStation=1&arrivalStation=36&rideDate=27.06.2019&currency=EUR&adult=1&children=0&bike_slot=0"
    }
}
```

## Similar Projects

- [search-flix-locations](https://github.com/derhuerst/search-flix-locations/) - Search for FlixBus (Meinfernbus) / FlixTrain cities & stations.
- [db-flix-cities](https://github.com/juliuste/db-flix-cities/) – Get all DB stations located in the same city as the given FlixBus / FlixTrain location, and vice versa.
- [db-hafas](https://github.com/derhuerst/db-hafas/) - JavaScript client for the DB Hafas API.
- [db-stations](https://github.com/derhuerst/db-stations/) - A list of DB stations.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/flix/issues).
