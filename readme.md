# meinfernbus

JavaScript client for the [Flixbus/Meinfernbus](https://www.flixbus.de/) API. Complies with the [friendly public transport format](https://github.com/public-transport/friendly-public-transport-format).

[![npm version](https://img.shields.io/npm/v/meinfernbus.svg)](https://www.npmjs.com/package/meinfernbus)
[![Build Status](https://travis-ci.org/juliuste/meinfernbus.svg?branch=master)](https://travis-ci.org/juliuste/meinfernbus)
[![dependency status](https://img.shields.io/david/juliuste/meinfernbus.svg)](https://david-dm.org/juliuste/meinfernbus)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/meinfernbus.svg)](https://david-dm.org/juliuste/meinfernbus#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/meinfernbus.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/public-transport.svg)](https://gitter.im/public-transport)

## Installation

```shell
npm install meinfernbus
```

## Usage

```javascript
const mfb = require('meinfernbus')
```

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). Please note that due do naming conflicts between the original *Meinfernbus* API and the *Friendly public transport format*, there are actually two types of `station` in this client. The original API distinguishes `cities` and `stations` where `Berlin` would be a city and `Berlin central bus station` would be a `station`. *FPTF* implies that actually both **must** be stations. Thats why the module structure looks as follows:

- `stations([opt])` to get a list of **all** operated stations (stations as in *FPTF*, therefore also including `cities`). Combined results from `stations.cities` and `stations.stations`.
- [`stations.cities([opt])`](docs/stations.cities.md) to get a list of all operated cities.
- [`stations.stations([opt])`](docs/stations.stations.md) to get a list of all operated stations (not including `cities`, as in the original *meinfernbus API*).

- [`journeys(origin, destination, date, [opt])`](docs/journeys.md) to get routes between stations (default: cities).

## Similar Projects

- [search-meinfernbus-locations](https://github.com/derhuerst/search-meinfernbus-locations/) - "Search for Flixbus/MeinFernbus cities & stations."
- [db-meinfernbus-cities](https://github.com/juliuste/db-meinfernbus-cities/) – "Get all DB stations located in the same city as the given Meinfernbus location, and vice versa."
- [db-hafas](https://github.com/derhuerst/db-hafas/) - "JavaScript client for the DB Hafas API."
- [db-stations](https://github.com/derhuerst/db-stations/) - "A list of DB stations."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/meinfernbus/issues).
