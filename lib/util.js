'use strict'

const moment = require('moment-timezone')
const slug = require('slugg')

const formatDateTime = (date) => {
	return moment(date).tz('Europe/Berlin').format('DD.MM.YYYY')
}

const parseDateTime = (date) => {
	return moment.unix(+date.timestamp).utcOffset(date.tz).format()
}

const normalizeEmpty = (val) => {
	return (val === undefined || val === '') ? null : val
}

const parseSparseStation = (s) => ({
	type: 'station',
	id: s.id + '',
	name: normalizeEmpty(s.name),
})

const parseCountry = (country) => {
	if (!country) return null
	return {
		name: normalizeEmpty(country.name),
		code: normalizeEmpty(country.alpha2_code),
	}
}

const parseStation = (s) => ({
	...parseSparseStation(s),
	location: {
		type: 'location',
		longitude: normalizeEmpty(s.coordinates.longitude),
		latitude: normalizeEmpty(s.coordinates.latitude),
		address: normalizeEmpty(s.full_address),
		street: normalizeEmpty(s.address),
		zip: normalizeEmpty(s.zip),
		country: parseCountry(s.country),
		notes: normalizeEmpty(s.warnings),
	},
	importance: Number.isInteger(s.importance_order) ? normalizeEmpty(+s.importance_order) : null,
})

const parseOperator = (o) => ({
	type: 'operator',
	id: o.key ? o.key : (o.label ? slug(o.label) : null),
	name: o.label,
	url: normalizeEmpty(o.url),
	address: normalizeEmpty(o.address),
})

const parseWhen = (keys, data, cancelled = false) => {
	let plannedWhen = (keys.planned && data[keys.planned]) || null
	if (plannedWhen) {
		plannedWhen = parseDateTime(plannedWhen)
	}
	let prognosedWhen = (keys.prognosed && data[keys.prognosed]) || null
	if (prognosedWhen && prognosedWhen.eta) {
		prognosedWhen = parseDateTime(prognosedWhen.eta)
	}
	const delay = plannedWhen && prognosedWhen
		? Math.round((new Date(prognosedWhen) - new Date(plannedWhen)) / 1000)
		: null

	if (cancelled) {
		return {
			when: null,
			plannedWhen,
			prognosedWhen,
			delay,
		}
	}
	return {
		when: prognosedWhen || plannedWhen,
		plannedWhen,
		delay,
	}
}

const parseStopover = (st) => {
	const arrCancelled = st.arrival_had && st.arrival_had.status === 'trip_cancelled'
	const arr = parseWhen({
		planned: 'arrival',
		prognosed: 'arrival_had',
	}, st, arrCancelled)
	const depCancelled = st.departure_had && st.departure_had.status === 'trip_cancelled'
	const dep = parseWhen({
		planned: 'departure',
		prognosed: 'departure_had',
	}, st, depCancelled)

	return {
		station: parseStation(st.station),
		cancelled: !!depCancelled && !!arrCancelled,
		arrival: arr.when,
		plannedArrival: arr.plannedWhen,
		arrivalDelay: arr.delay,
		departure: dep.when,
		plannedDeparture: dep.plannedWhen,
		departureDelay: dep.delay,
	}
}

const parseSparseTrip = (id, trip) => {
	return {
		id,
		direction: trip.line_direction,
		// @todo fall back to parsing trip.line_direction?
		lineName: normalizeEmpty(trip.line_code),
		operator: trip.operated_by ? parseOperator(trip.operated_by) : null,
		cancelled: normalizeEmpty(trip.is_cancelled),
		stopovers: trip.stops ? trip.stops.map(st => parseStopover(st)) : null,
	}
}

module.exports = {
	formatDateTime,
	parseDateTime,
	normalizeEmpty,
	parseSparseStation,
	parseStation,
	parseOperator,
	parseWhen,
	parseStopover,
	parseSparseTrip,
}
