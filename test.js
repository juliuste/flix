'use strict'

const tapeWithoutPromise = require('tape')
const addPromiseSupport = require('tape-promise').default
const tape = addPromiseSupport(tapeWithoutPromise)
const getStream = require('get-stream').array
const isEqual = require('lodash/isEqual')
const validate = require('validate-fptf')()
const moment = require('moment-timezone')
const isURL = require('is-url-superb')
const fptiTests = require('fpti-tests')

const flix = require('.')
const pkg = require('./package.json')

const when = moment.tz('Europe/Berlin').day(11).startOf('day').add('13', 'hour').toDate() // next thursday, 13:00

tape('flix fpti tests', async t => {
	await t.doesNotReject(fptiTests.packageJson(pkg), 'valid package.json')
	t.doesNotThrow(() => fptiTests.packageExports(flix, ['stations.all', 'regions.all', 'journeys']), 'valid module exports')
	t.doesNotThrow(() => fptiTests.stationsAllFeatures(flix.stations.all.features, []), 'valid stations.all features')
	t.doesNotThrow(() => fptiTests.regionsAllFeatures(flix.regions.all.features, []), 'valid regions.all features')
	t.end()
})

tape('flix.stations.all', async t => {
	const stations = await getStream(flix.stations.all())

	// base-check all stations
	t.ok(stations.length > 30, 'number of stations')
	for (let station of stations) t.doesNotThrow(() => validate(station), 'valid fptf')

	// deep-check berlin station
	const berlin = stations.filter((x) => x.id === '1')[0]
	t.ok(berlin.id === '1', 'berlin id')
	t.ok(berlin.name === 'Berlin central bus station', 'berlin name')
	t.ok(berlin.location.street === 'Masurenallee 4-6', 'berlin street')
	t.ok(berlin.location.zip === '14057', 'berlin zip')
	t.ok(berlin.location.address === 'Masurenallee 4-6, 14057 Berlin, Germany', 'berlin address')
	t.ok(isEqual(berlin.location.country, { name: 'Germany', code: 'DE' }), 'berlin country')
	t.ok(berlin.aliases.length >= 0, 'berlin aliases')
	t.ok(isEqual(berlin.regions, ['88']), 'berlin regions')
	t.ok(berlin.connections.length > 20, 'berlin connections')
	t.ok(berlin.slug === 'berlin-zob', 'berlin slug')

	t.end()
})

tape('flix.regions.all', async t => {
	const regions = await getStream(flix.regions.all())

	// base-check all regions
	t.ok(regions.length > 30, 'number of regions')
	// @todo fptf validation is disabled until a validate-fptf bug is fixed
	//  that only allows objects in region.stations, but no ids
	// for (let region of regions) t.doesNotThrow(() => validate(region), 'valid fptf')

	// deep-check berlin region
	const berlin = regions.filter((x) => x.id === '88')[0]
	t.ok(berlin.id === '88', 'berlin id')
	t.ok(berlin.name === 'Berlin', 'berlin name')
	t.ok(isEqual(berlin.location.country, { name: 'Germany', code: 'DE' }), 'berlin country')
	t.ok(berlin.class === 'A', 'berlin class')
	t.ok(berlin.stations.length > 4, 'berlin stations')
	t.ok(berlin.connections.length > 20, 'berlin connections')
	t.ok(berlin.slug === 'berlin', 'berlin slug')

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
