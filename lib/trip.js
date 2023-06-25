'use strict'

const {
	parseDateTime,
	normalizeEmpty,
	parseSparseTrip,
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
		...parseSparseTrip(t.uid, trip),
		tripType: t.type, // don't conflict with FPTF's `type`
		realtimeDataUpdatedAt: (
			t.real_time_info && t.real_time_info.status !== 'too_soon'
				? parseDateTime(t.real_time_info.updated_at)
				: null
		),
		hasTracker: normalizeEmpty(trip.has_tracker),
		// @todo trip.messages
	}
}

trip.features = { // require by fpti
	...fetch.features,
}

module.exports = trip
