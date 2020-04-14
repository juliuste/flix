'use strict'

const moment = require('moment-timezone')
const { journeys: validateArguments } = require('fpti-util').validateMethodArguments
const merge = require('lodash/merge')
const flatMap = require('lodash/flatMap')
const take = require('lodash/take')
const fill = require('lodash/fill')
const uniq = require('lodash/uniq')
const sortBy = require('lodash/sortBy')
const slug = require('slugg')

const fetch = require('./fetch')

const m = (a) => ((a === undefined || a === '') ? null : a)
const formatInputDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YYYY')
const formatOutputDate = (date) => moment.unix(+date.timestamp).utcOffset(date.tz).format()

const createOperator = (o) => ({
	type: 'operator',
	id: o.key,
	name: o.label,
	url: o.url,
	address: o.address,
})

const createStation = (s) => ({
	type: 'station',
	id: s.id + '',
	name: s.name,
	importance: Number.isInteger(s.importance_order) ? s.importance_order : null,
})

const extractLegs = (rawOrigin, rawDestination, rawJourney) => {
	let {
		departure,
		arrival,
		operated_by: operators,
		interconnection_transfers: transfers,
		transfer_type_key: transferType,
	} = rawJourney

	const legs = []
	operators = operators.map(createOperator)
	if (operators.length === 1) operators = fill(Array((transfers.length || 0) + 1), operators[0])
	else if (operators.length !== (transfers.length || 0) + 1) operators = null
	if (transfers && transfers.length) {
		// first leg
		legs.push({
			origin: createStation(rawOrigin),
			destination: createStation({ id: transfers[0].station_id, name: transfers[0].station_name }),
			departure: formatOutputDate(departure),
			arrival: formatOutputDate(transfers[0].arrival),
			// shuttle: transfers[0].shuttle_transfer,
			hint: transfers[0].message || null,
			operator: operators ? operators[0] : null,
		})

		// middle legs

		for (let i = 1; i < transfers.length - 1; i++) {
			legs.push({
				origin: createStation({ id: transfers[i].station_id, name: transfers[i].station_name }),
				destination: createStation({ id: transfers[i + 1].station_id, name: transfers[i + 1].station_name }),
				departure: formatOutputDate(transfers[i].departure),
				arrival: formatOutputDate(transfers[i + 1].arrival),
				hint: transfers[i].message || null,
				operator: operators ? operators[i] : null,
			})
		}

		// last legs
		legs.push({
			origin: createStation({ id: transfers[transfers.length - 1].station_id, name: transfers[transfers.length - 1].station_name }),
			destination: createStation(rawDestination),
			departure: formatOutputDate(transfers[transfers.length - 1].departure),
			arrival: formatOutputDate(arrival),
			// shuttle: transfers[transfers.length-1].shuttle_transfer,
			hint: transfers[transfers.length - 1].message || null,
			operator: operators ? operators[transfers.length - 1] : null,
		})
	} else {
		legs.push({
			origin: createStation(rawOrigin),
			destination: createStation(rawDestination),
			departure: formatOutputDate(departure),
			arrival: formatOutputDate(arrival),
			operator: operators ? operators[0] : null,
		})
	}

	for (const leg of legs) {
		leg.mode = (transferType && transferType === 'train') ? 'train' : 'bus'
		leg.public = true
	}
	return legs
}

const createJourney = ({ rawOrigin, rawDestination, links, rawJourney, currency }) => {
	const journey = {
		type: 'journey',
		id: slug(m(rawJourney.uid)), // @todo
		legs: extractLegs(rawOrigin, rawDestination, rawJourney),
		status: m(rawJourney.status),
		borders: m(rawJourney.transborder),
		info: {
			title: m(rawJourney.info_title),
			hint: m(rawJourney.info_title_hint),
			message: m(rawJourney.info_message),
			warnings: m(rawJourney.warnings),
		},
	}

	if (m(rawJourney.price_total_sum) && m(rawJourney.price_total_sum) > 0) {
		journey.price = {
			amount: m(rawJourney.price_total_sum) || null, // bad hack
			currency,
			discounts: m(rawJourney.discounts), // ???
			saleRestriction: m(rawJourney.sale_restriction), // ???
			available: (rawJourney.available && rawJourney.status !== 'full'), // is this correct?
			url: (links.find(l => l.rel === 'shop:search') || {}).href || null,
		}
	}

	return journey
}

// default options
const defaults = () => ({
	// fpti options
	when: null,
	departureAfter: null,
	results: null,
	transfers: null,
	interval: null,
	currency: 'EUR',

	// module-specific options
	language: 'en',
	adults: 1,
	children: 0,
	bicycles: 0,
})

const journeys = async (origin, destination, opt = {}) => {
	// merge options with defaults
	const def = defaults()
	if (!(opt.departureAfter || opt.when)) def.departureAfter = new Date()
	const options = merge({}, def, opt)

	// prepare origin and destination for validation
	const originDestinationTypes = uniq([origin.type || 'station', destination.type || 'station'])
	if (originDestinationTypes.length !== 1) throw new Error('`origin` and `destination` must have the same type')
	const [originDestinationType] = originDestinationTypes
	if (!['region', 'station'].includes(originDestinationType)) throw new Error('`origin` and `destination` must have type `station` or `region`')
	if (typeof origin !== 'string') origin = origin.id
	if (typeof destination !== 'string') destination = destination.id

	// validate origin, destination and fpti options
	validateArguments(origin, destination, options)

	// validate module-specific options
	if (typeof options.language !== 'string' || options.language.length !== 2) throw new Error('`opt.language` must be an ISO 639-1 language code')
	if (!Number.isInteger(options.adults) || options.adults < 1) throw new Error('`opt.adults` must be a positive integer')
	if (!Number.isInteger(options.children) || options.children < 0) throw new Error('`opt.children` must be a non-negative integer')
	if (!Number.isInteger(options.bicycles) || options.bicycles < 0) throw new Error('`opt.bicycles` must be a non-negative integer')

	const date = options.when || options.departureAfter
	const endDate = moment(date).add(options.interval || 0, 'minutes').toDate()

	let endDateReached = false
	let currentDate = date
	let journeys = []
	do {
		const { trips } = await fetch('trip/search.json', opt, {
			'X-User-Country': 'de',
		}, {
			from: +origin,
			to: +destination,
			departure_date: formatInputDate(currentDate),
			return_date: null,
			back: 0, // @todo
			search_by: originDestinationType === 'station' ? 'stations' : 'cities',
			currency: options.currency,
			adult: +options.adults,
			children: +options.children,
			bikes: +options.bicycles,
		})

		const rawJourneys = flatMap(trips, trip => trip.items.map(rawJourney => ({ rawOrigin: trip.from, rawDestination: trip.to, links: trip.links, rawJourney, currency: options.currency })))

		if (rawJourneys.length === 0) break

		const newJourneys = sortBy(rawJourneys.map(createJourney), journey => +new Date(journey.legs[0].departure))
		journeys.push(...newJourneys)

		currentDate = moment.tz(currentDate, 'Europe/Berlin').add(1, 'days').startOf('day').toDate()
		endDateReached = +currentDate > +endDate
	} while (!endDateReached)

	journeys = journeys.filter(j => +new Date(j.legs[0].departure) >= +date)
	if (typeof options.interval === 'number') journeys = journeys.filter(j => +new Date(j.legs[0].departure) <= +endDate)
	if (typeof options.transfers === 'number') journeys = journeys.filter(j => j.legs.length <= options.transfers + 1)
	if (typeof options.results === 'number') journeys = take(journeys, options.results)
	return journeys
}
journeys.features = { // required by fpti
	...fetch.features,
	when: 'Journey date, synonym to departureAfter',
	departureAfter: 'List journeys with a departure (first leg) after this date',
	results: 'Max. number of results returned',
	transfers: 'Max. number of transfers',
	interval: 'Results for how many minutes after / before when (depending on whenRepresents)',
	currency: 'Currency for journey.price',
	language: 'Language of the results, ISO 639-1 code',
	adults: 'Number of traveling adults',
	children: 'Number of traveling children',
	bicycles: 'Number of traveling bicycles',
}

module.exports = journeys
