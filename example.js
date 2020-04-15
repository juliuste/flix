'use strict'

const assert = require('assert')
const flix = require('.')

const find = (name, stream) => {
	return new Promise((resolve, reject) => {
		stream.once('error', reject)
		stream.on('data', (item) => {
			if (item.name === name) resolve(item)
		})
		stream.once('end', () => resolve(null))
	})
}

;(async () => {
	const berlin = await find('Berlin', flix.regions.all())
	assert.ok(berlin, 'Berlin not found')
	const hamburg = await find('Hamburg', flix.regions.all())
	assert.ok(hamburg, 'Hamburg not found')
	const berlinAlexanderplatz = await find('Berlin Alexanderplatz', flix.stations.all())
	assert.ok(berlinAlexanderplatz, 'Berlin Alexanderplatz not found')

	const [journey] = await flix.journeys(berlin, hamburg, {
		departureAfter: new Date('2020-06-01T08:00+02:00'),
		results: 1,
	})
	console.error(journey)

	const [depAtAlexanderplatz] = await flix.departures(berlinAlexanderplatz)
	console.error(depAtAlexanderplatz)

	const trip = await flix.trip(depAtAlexanderplatz.tripId)
	console.error(trip)

	const bookingNr = process.env.BOOKING_NR
	const nameOrEmail = process.env.NAME_OR_EMAIL
	if (bookingNr && nameOrEmail) {
		console.log(await flix.order(bookingNr, nameOrEmail))
	}
})()
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
