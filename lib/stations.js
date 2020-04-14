'use strict'

const csv = require('tiny-csv')
const merge = require('lodash/merge')
const fetch = require('./fetch')
const intoStream = require('into-stream').object
const {
	normalizeEmpty: m,
	parseStation,
} = require('./util')

const defaults = {
}

const formatCountry = (country) => (country ? { name: m(country.name), code: m(country.alpha2_code) } : null)

const createStation = (station) => {
	const res = parseStation(station)
	return {
		...res,
		location: {
			...res.location,
			country: formatCountry(station.country),
			zip: station.zip,
		},
		slug: m(station.slugs),
		aliases: (station.aliases ? csv(station.aliases) : null),
		regions: [m(station.city_id + '')].filter((x) => !!x),
		connections: m(station.pairs),
	}
}

const allAsync = async (opt) => {
	const options = merge({}, defaults, opt)
	const results = await fetch('network.json', options)
	return results.stations.map(createStation)
}

const all = (opt = {}) => {
	return intoStream(allAsync(opt))
}
all.features = { // required by fpti
	...fetch.features,
}

module.exports = { all }
