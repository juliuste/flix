'use strict'

const tapeWithoutPromise = require('tape')
const addPromiseSupport = require('tape-promise').default
const tape = addPromiseSupport(tapeWithoutPromise)
const isEqual = require('lodash/isEqual')
const validate = require('validate-fptf')
const moment = require('moment-timezone')
const isURL = require('is-url-superb')

const flix = require('.')

const when = moment.tz('Europe/Berlin').day(11).startOf('day').add('13', 'hour').toDate() // next thursday, 13:00

tape('flix.stations', async t => {
	const stations = await flix.stations()

	t.ok(stations.length > 30, 'stations length')
	for (let station of stations) validate(station)

	const berlin = stations.filter((x) => x.id === '1')[0]
	t.ok(berlin.id === '1', 'stations berlin id')
	t.ok(berlin.name === 'Berlin central bus station', 'stations berlin name')
	t.ok(berlin.location.street === 'Masurenallee 4-6', 'stations berlin street')
	t.ok(berlin.location.zip === '14057', 'stations berlin zip')
	t.ok(berlin.location.address === 'Masurenallee 4-6, 14057 Berlin, Germany', 'stations berlin address')
	t.ok(isEqual(berlin.location.country, { name: 'Germany', code: 'DE' }), 'stations berlin country')
	t.ok(berlin.aliases.length >= 0, 'stations berlin aliases')
	t.ok(isEqual(berlin.regions, ['88']), 'stations berlin regions')
	t.ok(berlin.connections.length > 20, 'stations berlin connections')
	t.ok(berlin.slug === 'berlin-zob', 'stations berlin slug')
	t.end()
})

tape('flix.regions', async t => {
	const regions = await flix.regions()

	t.ok(regions.length > 30, 'regions length')
	for (let region of regions) validate(region)

	const berlin = regions.filter((x) => x.id === '88')[0]
	t.ok(berlin.id === '88', 'regions berlin id')
	t.ok(berlin.name === 'Berlin', 'regions berlin name')
	t.ok(isEqual(berlin.location.country, { name: 'Germany', code: 'DE' }), 'regions berlin country')
	t.ok(berlin.class === 'A', 'regions berlin class')
	t.ok(berlin.stations.length > 4, 'regions berlin stations')
	t.ok(berlin.connections.length > 20, 'regions berlin connections')
	t.ok(berlin.slug === 'berlin', 'regions berlin slug')
	t.end()
})

const isBerlin = s => (s.type === 'station' && s.name.substr(0, 6) === 'Berlin')
const isFrankfurt = s => (s.type === 'station' && s.name.substr(0, 9) === 'Frankfurt')
const isStuttgart = s => (s.type === 'station' && s.name.substr(0, 9) === 'Stuttgart')

tape('flix.journeys bus', async t => {
	// Berlin -> Frankfurt
	const journeys = await flix.journeys({ id: '88', type: 'region' }, { id: '96', type: 'region' }, when)

	t.ok(journeys.length > 1, 'journeys length')
	for (let journey of journeys) validate(journey)

	const [journey] = journeys
	t.ok(isBerlin(journey.legs[0].origin), 'leg origin')
	t.ok(isFrankfurt(journey.legs[journey.legs.length - 1].destination), 'leg destination')
	t.ok(journey.legs.every(l => l.mode === 'bus'), 'leg mode')
	t.ok(journey.legs.every(l => l.operator.id === 'mfb'), 'leg operator id')
	t.ok(journey.price.currency === 'EUR', 'price currency')
	t.ok(isURL(journey.price.url), 'price url')
	t.end()
})

tape('flix.journeys train', async t => {
	// Berlin -> Stuttgart
	const journeys = await flix.journeys({ id: '88', type: 'region' }, { id: '101', type: 'region' }, when)

	t.ok(journeys.length > 1, 'journeys length')
	for (let journey of journeys) validate(journey)

	// journey with 1 leg, starting at Berlin-Lichtenberg
	const journey = journeys.find(x => x.legs.length === 1 && x.legs[0].origin.id === '20718')
	t.ok(!!journey, 'journey')
	t.ok(isBerlin(journey.legs[0].origin), 'leg origin')
	t.ok(isStuttgart(journey.legs[journey.legs.length - 1].destination), 'leg destination')
	t.ok(journey.legs.every(l => l.mode === 'train'), 'leg mode')
	t.ok(journey.legs.every(l => l.operator.id === 'train'), 'leg operator id')
	t.ok(journey.price.currency === 'EUR', 'price currency')
	t.ok(isURL(journey.price.url), 'price url')
	t.end()
})
