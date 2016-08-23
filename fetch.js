'use strict'

const got = require('got')

const request = (route, headers, query) =>
	got('http://api.meinfernbus.de/mobile/v1/' + route, {json: true, headers, query})

module.exports = request
