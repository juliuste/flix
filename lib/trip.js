'use strict'

const {
	parseDateTime,
	parseOperator,
	parseStopover,
	normalizeEmpty,
} = require('./util')
const fetch = require('./fetch')

const trip = async (tripId, opt = {}) => {
	opt = {
		...opt,
	}

	if (typeof tripId !== 'string' || !tripId) {
		throw new Error('tripId is must be a non-empty string')
	}

	const t = await fetch(`trips/${encodeURIComponent(tripId)}/info.json`, opt)
	const [trip] = t.trips

	return {
		id: t.uid,
		tripType: t.type, // don't conflict with FPTF's `type`
		direction: trip.line_direction,
		lineName: trip.line_code,
		operator: trip.operated_by ? parseOperator(trip.operated_by) : null,
		cancelled: trip.is_cancelled === true,
		realtimeDataUpdatedAt: (
			t.real_time_info && t.real_time_info.status !== 'too_soon'
				? parseDateTime(t.real_time_info.updated_at)
				: null
		),
		stopovers: trip.stops.map(st => parseStopover(st)),
		hasTracker: normalizeEmpty(trip.has_tracker),
		// @todo trip.messages
	}
}

trip.features = { // require by fpti
	...fetch.features,
}

module.exports = trip
