'use strict'

const {
	normalizeEmpty,
	parseSparseTrip,
	parseStation,
	parseWhen,
} = require('./util')
const fetch = require('./fetch')

const parseNote = (note) => {
	return {
		type: note.name,
		title: note.title,
		html: note.html,
	}
}

const order = async (bookingNr, nameOrEmail, opt = {}) => {
	opt = {
		...opt,
	}

	if (typeof bookingNr !== 'string' || !bookingNr) {
		throw new Error('bookingNr is invalid')
	}
	if (typeof nameOrEmail !== 'string' || !nameOrEmail) {
		throw new Error('nameOrEmail is invalid')
	}

	let res
	try {
		res = await fetch(`orders/${encodeURIComponent(bookingNr)}/search.json`, {
			...opt,
			endpoint: 'https://api.flixbus.com/mobile/v2/',
		}, {}, {
			query: nameOrEmail,
		})
	} catch (err) {
		if (err.statusCode === 404) return null
		throw err
	}

	return {
		id: res.order.order_uid,
		bookingNr: res.order.id,
		downloadCode: res.download_hash,
		qrCodeUrl: res.order.qr_image,
		bookingConfirmationUrl: res.order.reminder_link,
		// @todo res.order.invoices
		// @todo res.order.attachments
		notes: res.order.info_blocks.map(parseNote),
		legs: res.order.trips.map((trip) => ({
			...parseSparseTrip(null, trip),
			tripId: trip.trip_uid,
			origin: parseStation(trip.departure_station),
			departure: parseWhen({ planned: 'departure' }, trip, false).when,
			destination: parseStation(trip.arrival_station),
			arrival: parseWhen({ planned: 'arrival' }, trip, false).when,
			orderStatus: trip.order_status,
			passengers: trip.passengers.map((p) => ({
				type: p.type,
				firstName: normalizeEmpty(p.firstname),
				lastName: normalizeEmpty(p.lastname),
				phone: normalizeEmpty(p.phone),
			})),
			appleWalletUrl: trip.passbook_url,
			warnings: trip.warnings,
			// @todo p.push_channel_uid, p.seats_per_relation
		})),
	}
}

order.features = { // require by fpti
	...fetch.features,
}

module.exports = order
