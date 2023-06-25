'use strict'

const {
	parseWhen,
	parseStation,
	normalizeEmpty,
} = require('./util')
const fetch = require('./fetch')

const parseArrivalDeparture = (dep, station) => {
	const cancelled = dep.is_cancelled === true
	const {
		when,
		plannedWhen,
		prognosedWhen,
		delay,
	} = parseWhen({
		planned: 'datetime',
		// @todo does this route provide realtime data?
	}, dep, cancelled)

	return {
		tripId: dep.trip_uid, // @todo: `dep.ride_id`?
		when,
		plannedWhen,
		prognosedWhen,
		delay,
		cancelled,
		direction: dep.direction,
		lineName: dep.line_code,
		stop: station,
		route: dep.route.map(s => parseStation(s)),
		routeAbbreviation: dep.through_the_stations,
		hasTracker: normalizeEmpty(dep.has_tracker),
	}
}

const _timetable = async (station, opt = {}) => {
	opt = {
		// @todo
		when: null,
		departureAfter: new Date(),
		...opt,
	}

	if (typeof station !== 'string') {
		if (station.type !== 'station') throw new Error('station is invalid')
		station = station.id
	}

	const when = opt.when || opt.departureAfter
	if (!when || !(when instanceof Date)) {
		throw new Error('opt.departureAfter/opt.when must be null or a Date')
	}

	const res = await fetch(`network/station/${encodeURIComponent(station)}/timetable.json`, opt)
	return res
}

const departuresToday = async (station, opt = {}) => {
	const t = await _timetable(station, opt)

	if (!t.timetable || !Array.isArray(t.timetable.departures)) return []
	station = parseStation(t.station)
	return t.timetable.departures
		.map(dep => parseArrivalDeparture(dep, station))
}
const arrivalsToday = async (station, opt = {}) => {
	const t = await _timetable(station, opt)

	if (!t.timetable || !Array.isArray(t.timetable.arrivals)) return []
	station = parseStation(t.station)
	return t.timetable.arrivals
		.map(dep => parseArrivalDeparture(dep, station))
}

departuresToday.features = arrivalsToday.features = { // require by fpti
	...fetch.features,
}

module.exports = {
	departuresToday,
	arrivalsToday,
}
