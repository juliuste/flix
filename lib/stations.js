'use strict'

const csv = require('tiny-csv')
const union = require('lodash.union')

const fetch = require('./fetch')

const m = (a) => ((a===undefined) ? null : a)

const defaults = {
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n',
	caching: true
}

const formatCountry = (country) => (country ? {name: m(country.name), code: m(country.alpha2_code)} : null)

const transformStation = (station) => ({
    type: 'station',
    subtype: 'station',
	id: +station.id,
	name: m(station.name),
	street: m(station.address),
	zip: station.zip,
	address: m(station.full_address),
	coordinates: m(station.coordinates),
	slug: m(station.slugs),
	aliases: (station.aliases ? csv(station.aliases) : null),
	city: m(+station.city_id),
	connections: m(station.pairs),
	importance: m(+station.importance_order),
	country: formatCountry(station.country)
})
const transformStations = (body) => body.stations.map(transformStation)

const transformCity = (city) => ({
    type: 'station',
    subtype: 'city',
	id: +city.id,
	name: m(city.name),
	coordinates: m(city.coordinates),
	country: formatCountry(city.country),
	class: m(city.classes),
	stations: m(city.stations),
	connections: m(city.pairs),
	slug: m(city.slugs),
})
const transformCities = (body) => body.cities.map(transformCity)

const request = (parseFunction, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return fetch('network.json', {
		'X-API-Authentication': opt.key,
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)'
	})
	.then(parseFunction)
}

const cities = (opt) => request(transformCities, opt)
const stations = (opt) => request(transformStations, opt)
const all = (opt) => Promise.all([cities(opt), stations(opt)]).then(([c, s]) => union(c, s))

module.exports = all
module.exports.cities = cities
module.exports.stations = stations
