# meinfernbus

JavaScript client for the Flixbus/Meinfernbus API.

[![npm version](https://img.shields.io/npm/v/meinfernbus.svg)](https://www.npmjs.com/package/meinfernbus)
[![Build Status](https://travis-ci.org/juliuste/meinfernbus.svg?branch=master)](https://travis-ci.org/juliuste/meinfernbus)
[![dependency status](https://img.shields.io/david/juliuste/meinfernbus.svg)](https://david-dm.org/juliuste/meinfernbus)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/meinfernbus.svg)](https://david-dm.org/juliuste/meinfernbus#info=devDependencies)
[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

## Installation

```shell
npm install meinfernbus
```

## Usage

```javascript
const mfb = require('meinfernbus')
```

- [`trips(from, to, date, [opt])`](docs/trips.md) to get routes between locations (default: cities).
- [`locations.cities([opt])`](docs/locations.cities.md) to get a list of all operated cities.
- [`locations.stations([opt])`](docs/locations.stations.md) to get a list of all operated stations.

## Similar Projects

- [search-meinfernbus-locations](https://github.com/derhuerst/search-meinfernbus-locations/) - "Search for Flixbus/MeinFernbus cities & stations."
- [db-meinfernbus-cities](https://github.com/juliuste/db-meinfernbus-cities/) – "Get all DB stations located in the same city as the given Meinfernbus location, and vice versa."
- [db-hafas](https://github.com/derhuerst/db-hafas/) - "JavaScript client for the DB Hafas API."
- [db-stations](https://github.com/derhuerst/db-stations/) - "A list of DB stations."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/meinfernbus/issues).
