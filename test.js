'use strict'

const mfb = require('./index')

const works = (text) => {console.log('works')}
const fails = (err) => {
	console.error(err.stack || err.message)
	process.exit(1)
}

mfb.trips(88,243, new Date()).then(works, fails)
mfb.locations.stations().then(works, fails)
mfb.locations.cities().then(works, fails)
