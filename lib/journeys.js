'use strict'

const moment = require('moment-timezone')
const fill = require('lodash/fill')
const isString = require('lodash/isString')
const isDate = require('lodash/isDate')
const slug = require('slugg')

const fetch = require('./fetch')

const isType = (t) => ['region', 'station'].indexOf(t) >= 0

const formatInputDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YYYY')
const formatOutputDate = (date) => moment.unix(+date.timestamp).utcOffset(date.tz).format()

const createOperator = (o) => ({
	type: 'operator',
	id: o.key,
	name: o.label,
	url: o.url,
	address: o.address
})
// const formatDuration = (duration) => (+duration.hour*60)+(+duration.minutes)

const m = (a) => ((a === undefined) ? null : a)

const createStation = (s) => ({
	type: 'station',
	id: s.id + '',
	name: s.name,
	importance: Number.isInteger(s.importance_order) ? s.importance_order : null
})

const defaults = {
	adults: 1,
	children: 0,
	bikes: 0,
	currency: 'EUR',
	searchBy: 'regions',
	back: 0, // ???
	key: 'k8LKgcuFoHnN5x/NdDYD6QSvjB4='
}

const hashLeg = (l) => [l.origin.id, l.departure, l.destination.id, l.arrival].join('_')

const extractLegs = (origin, destination, departure, arrival, operators, transfers, transferType) => {
	const legs = []
	operators = operators.map(createOperator)
	if (operators.length === 1) operators = fill(Array((transfers.length || 0) + 1), operators[0])
	else if (operators.length !== (transfers.length || 0) + 1) operators = null
	if (transfers && transfers.length) {
		// first leg
		legs.push({
			origin: createStation(origin),
			destination: createStation({ id: transfers[0].station_id, name: transfers[0].station_name }),
			departure: formatOutputDate(departure),
			arrival: formatOutputDate(transfers[0].arrival),
			// shuttle: transfers[0].shuttle_transfer,
			hint: transfers[0].message || null,
			operator: operators ? operators[0] : null
		})

		// middle legs

		for (let i = 1; i < transfers.length - 1; i++) {
			legs.push({
				origin: createStation({ id: transfers[i].station_id, name: transfers[i].station_name }),
				destination: createStation({ id: transfers[i + 1].station_id, name: transfers[i + 1].station_name }),
				departure: formatOutputDate(transfers[i].departure),
				arrival: formatOutputDate(transfers[i + 1].arrival),
				hint: transfers[i].message || null,
				operator: operators ? operators[i] : null
			})
		}

		// last legs
		legs.push({
			origin: createStation({ id: transfers[transfers.length - 1].station_id, name: transfers[transfers.length - 1].station_name }),
			destination: createStation(destination),
			departure: formatOutputDate(transfers[transfers.length - 1].departure),
			arrival: formatOutputDate(arrival),
			// shuttle: transfers[transfers.length-1].shuttle_transfer,
			hint: transfers[transfers.length - 1].message || null,
			operator: operators ? operators[transfers.length - 1] : null
		})
	} else {
		legs.push({
			origin: createStation(origin),
			destination: createStation(destination),
			departure: formatOutputDate(departure),
			arrival: formatOutputDate(arrival),
			operator: operators ? operators[0] : null
		})
	}

	for (let leg of legs) {
		leg.schedule = slug(hashLeg(leg))
		leg.mode = (transferType && transferType === 'train') ? 'train' : 'bus'
		leg.public = true
	}
	return legs
}

const createJourney = (origin, destination, links) => (trip) => ({
	type: 'journey',
	id: slug(m(trip.uid)),
	legs: extractLegs(origin, destination, trip.departure, trip.arrival, trip.operated_by, trip.interconnection_transfers, trip.transfer_type_key),
	status: m(trip.status),
	borders: m(trip.transborder),
	price: {
		amount: m(trip.price_total_sum) || null, // bad hack
		currency: 'EUR',
		discounts: m(trip.discounts), // ???
		saleRestriction: m(trip.sale_restriction), // ???
		available: (trip.available && trip.status !== 'full'), // is this correct?
		url: (links.find(l => l.rel === 'shop:search') || {}).href || null
	},
	info: {
		title: m(trip.info_title),
		hint: m(trip.info_title_hint),
		message: m(trip.info_message),
		warnings: m(trip.warnings)
	}
})

const createJourneys = (journeys) => {
	let result = []
	journeys.forEach((journey) => result.push(...journey.items.map(createJourney(journey.from, journey.to, journey.links))))
	return result
}

const journeys = (origin, destination, date, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	if (isString(origin)) origin = { id: origin, type: 'station' }
	if (isString(destination)) destination = { id: destination, type: 'station' }

	if (origin.type !== destination.type) throw new Error('origin and destination objects must have the same type')
	if (!isString(origin.id)) throw new Error('invalid or missing origin id')
	if (!isType(origin.type)) throw new Error('invalid or missing origin type')
	if (!isString(destination.id)) throw new Error('invalid or missing destination id')
	if (!isType(destination.type)) throw new Error('invalid or missing destination type')

	if (origin.type === 'station') {
		opt.searchBy = 'stations'
	} else {
		opt.searchBy = 'cities'
	}
	origin = origin.id
	destination = destination.id

	if (!isDate(date)) throw new Error('`date` must be a JS Date() object')

	return fetch('trip/search.json', {
		'X-API-Authentication': opt.key,
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)',
		'X-User-Country': 'de'
	}, {
		from: +origin,
		to: +destination,
		departure_date: formatInputDate(date),
		return_date: null,
		back: +opt.back,
		search_by: opt.searchBy,
		currency: opt.currency,
		adult: +opt.adults,
		children: +opt.children,
		bikes: +opt.bikes
	})
		.then((data) => data.trips)
		.then((data) => createJourneys(data))
}

module.exports = journeys
