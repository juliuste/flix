'use strict'

const fetch = require('./fetch')

const m = (a) => ((a === undefined) ? null : a)

const defaults = {
	key: 'k8LKgcuFoHnN5x/NdDYD6QSvjB4=',
	caching: true
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
		country: formatCountry(city.country)
	},
	class: m(city.classes),
	stations: (m(city.stations) || []).map(s => s + ''),
	connections: m(city.pairs),
	slug: m(city.slugs)
})

const regions = (opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return fetch('network.json', {
		'X-API-Authentication': opt.key,
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)'
	})
		.then((data) => data.cities)
		.then((regions) => regions.map(createRegion))
}

module.exports = regions
