'use strict'

const mfb = require('./index')
const assert = require('assert')

const works = (text) => {console.log('works')}

mfb.trips(88,243, new Date()).then(works, assert.ifError)
mfb.locations.stations().then(works, assert.ifError)
mfb.locations.cities().then(works, assert.ifError)