'use strict'

const got = require('got')
const csv = require('tiny-csv')

const err = (error) => {throw error}
const m = (a) => ((a===undefined) ? null : a)

const defaults = {
	key: 'uR=s7k6m=[cCS^zY86H8CNAnkC6n'
}

let etag = null
let data = null

const formatCountry = (country) => (country ? {name: m(country.name), code: m(country.alpha2_code)} : null)
const parseEtag = (etag) => ((etag.substring(0,2)=='W/') ? etag.substring(2) : etag)

const parseStation = (station) => ({
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
const parseStations = (body) => body.stations.map(parseStation)

const parseCity = (city) => ({
	id: +city.id,
	name: m(city.name),
	coordinates: m(city.coordinates),
	country: formatCountry(city.country),
	class: m(city.classes),
	stations: m(city.stations),
	connections: m(city.pairs),
	slug: m(city.slugs),
})
const parseCities = (body) => body.cities.map(parseCity)

const request = (parseFunction, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	const headers = {
		'X-API-Authentication': opt.key,
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)'
	}
	if (etag) headers['If-None-Match'] = etag

	return got('http://api.meinfernbus.de/mobile/v1/network.json', {json: true, headers})
		.then((res) => {
			const newEtag = parseEtag(res.headers.etag)
			if (newEtag !== etag) {
				data = parseFunction(res.body)
				etag = newEtag
			}
			return data
		}, (res) => {
			if (res.statusCode === 304 && data) return data
			else throw res
		})
}

const cities = (opt) => request(parseCities, opt)
const stations = (opt) => request(parseStations, opt)

module.exports = {cities, stations}
