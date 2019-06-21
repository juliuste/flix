'use strict'

const csv = require('tiny-csv')
const merge = require('lodash/merge')
const fetch = require('./fetch')
const intoStream = require('into-stream').object

const m = (a) => ((a === undefined || a === '') ? null : a)

const defaults = {
	apiKey: 'k8LKgcuFoHnN5x/NdDYD6QSvjB4='
}

const formatCountry = (country) => (country ? { name: m(country.name), code: m(country.alpha2_code) } : null)

const createStation = (station) => ({
	type: 'station',
	id: station.id + '',
	name: m(station.name),
	location: {
		type: 'location',
		longitude: m(station.coordinates.longitude),
		latitude: m(station.coordinates.latitude),
		address: m(station.full_address),
		country: formatCountry(station.country),
		zip: station.zip,
		street: m(station.address)
	},
	slug: m(station.slugs),
	aliases: (station.aliases ? csv(station.aliases) : null),
	regions: [m(station.city_id + '')].filter((x) => !!x),
	connections: m(station.pairs),
	importance: m(+station.importance_order)
})

const allAsync = async (opt) => {
	const options = merge({}, defaults, opt)
	const results = await fetch('network.json', {
		'X-API-Authentication': options.apiKey,
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)'
	})
	return results.stations.map(createStation)
}

const all = (opt = {}) => {
	return intoStream(allAsync(opt))
}
all.features = { // required by fpti
	apiKey: 'Custom API key'
}

module.exports = { all }
