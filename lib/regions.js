'use strict'

const fetch = require('./fetch')
const merge = require('lodash/merge')
const intoStream = require('into-stream').object

const m = (a) => ((a === undefined || a === '') ? null : a)

const defaults = {
}

const formatCountry = (country) => (country ? { name: m(country.name), code: m(country.alpha2_code) } : null)

const createRegion = (city) => ({
	type: 'region',
	id: city.id + '',
	name: m(city.name),
	location: {
		type: 'location',
		longitude: m(city.coordinates.longitude),
		latitude: m(city.coordinates.latitude),
		country: formatCountry(city.country),
	},
	class: m(city.classes),
	stations: (m(city.stations) || []).map(s => s + ''),
	connections: m(city.pairs),
	slug: m(city.slugs),
})

const allAsync = async (opt) => {
	const options = merge({}, defaults, opt)
	const results = await fetch('network.json', options)
	return results.cities.map(createRegion)
}

const all = (opt = {}) => {
	return intoStream(allAsync(opt))
}
all.features = { // required by fpti
	...fetch.features,
}

module.exports = { all }
