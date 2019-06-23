# flix

JavaScript client for the [FlixBus (Meinfernbus) / FlixTrain](https://www.flixbus.de/) API. Complies with the [friendly public transport format](https://github.com/public-transport/friendly-public-transport-format). Inofficial, using endpoints by *FlixMobility*. [Ask them](https://www.flixbus.com/company/partners/affiliate-partners) for permission before using this module in production.

[![npm version](https://img.shields.io/npm/v/flix.svg)](https://www.npmjs.com/package/flix)
[![Build Status](https://travis-ci.org/juliuste/flix.svg?branch=master)](https://travis-ci.org/juliuste/flix)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/flix.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/juliuste/flix.svg?style=flat)](LICENSE)
[![fptf version](https://fptf.badges.juliustens.eu/badge/juliuste/flix)](https://fptf.badges.juliustens.eu/link/juliuste/flix)
[![chat on gitter](https://badges.gitter.im/public-transport.svg)](https://gitter.im/public-transport)

## Installation

```shell
npm install flix
```

## Usage

```javascript
const flix = require('flix')
```

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

- [`stations([opt])`](docs/stations.md) to get a list of operated stations such as `Berlin central bus station` or `Frankfurt Hbf`.
- [`regions([opt])`](docs/regions.md) to get a list of all operated regions (cities) such as `Berlin` or `Frankfurt`.
- [`journeys(origin, destination, date, [opt])`](docs/journeys.md) to get routes between regions (cities) or stations (default: regions).

## Similar Projects

- [search-flix-locations](https://github.com/derhuerst/search-flix-locations/) - Search for FlixBus (Meinfernbus) / FlixTrain cities & stations.
- [db-flix-cities](https://github.com/juliuste/db-flix-cities/) – Get all DB stations located in the same city as the given FlixBus / FlixTrain location, and vice versa.
- [db-hafas](https://github.com/derhuerst/db-hafas/) - JavaScript client for the DB Hafas API.
- [db-stations](https://github.com/derhuerst/db-stations/) - A list of DB stations.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/flix/issues).
