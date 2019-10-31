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

const when = moment.tz('Europe/Berlin').day(11).startOf('day').add('06', 'hour').toDate() // next thursday, 06:00
const isStationThatBeginsWith = (s, beginsWith) => (s.type === 'station' && s.name.substr(0, beginsWith.length) === beginsWith)

tape('flix fpti tests', async t => {
	await t.doesNotReject(fptiTests.packageJson(pkg), 'valid package.json')
	t.doesNotThrow(() => fptiTests.packageExports(flix, ['stations.all', 'regions.all', 'journeys']), 'valid module exports')
	t.doesNotThrow(() => fptiTests.stationsAllFeatures(flix.stations.all.features, []), 'valid stations.all features')
	t.doesNotThrow(() => fptiTests.regionsAllFeatures(flix.regions.all.features, []), 'valid regions.all features')
	t.doesNotThrow(() => fptiTests.journeysFeatures(flix.journeys.features, ['when', 'departureAfter', 'results', 'interval', 'transfers', 'currency']), 'valid journeys features')
	t.end()
})

tape('flix.stations.all', async t => {
	const stations = await getStream(flix.stations.all())

	// base-check all stations
	t.ok(stations.length > 30, 'number of stations')
	for (const station of stations) t.doesNotThrow(() => validate(station), 'valid fptf')

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

tape('flix.journeys between stations', async t => {
	const hamburg = { type: 'station', id: '36' }
	const hannover = '64'

	const journeys = await flix.journeys(hamburg, hannover, { when })
	t.ok(journeys.length >= 3, 'number of journeys')
	for (const journey of journeys) {
		t.doesNotThrow(() => validate(journey), 'valid fptf')
		t.ok(isStationThatBeginsWith(journey.legs[0].origin, 'Hamburg'), 'origin')
		t.ok(isStationThatBeginsWith(journey.legs[journey.legs.length - 1].destination, 'Hanover'), 'destination')
		t.ok(+new Date(journey.legs[0].departure) >= +when, 'departure')
		t.ok(journey.price.amount > 0, 'price amount')
		t.ok(journey.price.currency === 'EUR', 'price currency')
		t.ok(isURL(journey.price.url), 'price url')
	}
})

tape('flix.journeys between regions', async t => {
	const hamburg = { type: 'region', id: '118' }
	const hannover = { type: 'region', id: '146' }

	const journeys = await flix.journeys(hamburg, hannover, { when })
	t.ok(journeys.length >= 3, 'number of journeys')
	for (const journey of journeys) {
		t.doesNotThrow(() => validate(journey), 'valid fptf')
		t.ok(isStationThatBeginsWith(journey.legs[0].origin, 'Hamburg'), 'origin')
		t.ok(isStationThatBeginsWith(journey.legs[journey.legs.length - 1].destination, 'Hanover'), 'destination')
		t.ok(+new Date(journey.legs[0].departure) >= +when, 'departure')
		t.ok(journey.price.amount > 0, 'price amount')
		t.ok(journey.price.currency === 'EUR', 'price currency')
		t.ok(isURL(journey.price.url), 'price url')
	}
})

tape('flix.journeys bus only, opt.currency', async t => {
	const berlin = { id: '88', type: 'region' }
	const szczecin = { id: '2125', type: 'region' }

	const journeys = await flix.journeys(berlin, szczecin, { when, currency: 'PLN' })
	t.ok(journeys.length >= 3, 'number of journeys')
	for (const journey of journeys) {
		t.doesNotThrow(() => validate(journey), 'valid fptf')
		for (const leg of journey.legs) {
			t.ok(leg.mode === 'bus', 'leg mode')
			t.ok(['mfb', 'flix', 'flixpl', 'interglo'].includes(leg.operator.id), 'leg operator id')
		}
		t.ok(journey.price.amount > 0, 'price amount')
		t.ok(journey.price.currency === 'PLN', 'price currency')
	}
})

tape('flix.journeys train only, opt.departureAfter', async t => {
	const berlin = { id: '88', type: 'region' }
	const stuttgart = { id: '101', type: 'region' }

	const journeys = await flix.journeys(berlin, stuttgart, { departureAfter: when })
	t.ok(journeys.length >= 3, 'number of journeys')
	for (const journey of journeys) {
		t.doesNotThrow(() => validate(journey), 'valid fptf')
		t.ok(+new Date(journey.legs[0].departure) >= +when, 'departure')
	}

	// journey without transfers, starting at Berlin-Lichtenberg
	const journey = journeys.find(x => x.legs.length === 1 && x.legs[0].origin.id === '20718')
	t.ok(!!journey, 'journey')
	for (const leg of journey.legs) {
		t.ok(leg.mode === 'train', 'leg mode')
		t.ok(['train'].includes(leg.operator.id), 'leg operator id')
	}
})

tape('flix.journeys opt.results', async t => {
	const berlin = { id: '88', type: 'region' }
	const stuttgart = { id: '101', type: 'region' }

	const journeys = await flix.journeys(berlin, stuttgart, { when, results: 2 })
	t.ok(journeys.length === 2, 'number of journeys')
})

tape('flix.journeys opt.transfers', async t => {
	const berlin = { id: '88', type: 'region' }
	const rome = { id: '2075', type: 'region' }

	const journeysWithoutTransfer = await flix.journeys(berlin, rome, { when, transfers: 0 })
	t.ok(journeysWithoutTransfer.length === 0, 'number of journeys')

	const journeysWithTransfer = await flix.journeys(berlin, rome, { when, transfers: 2 })
	t.ok(journeysWithTransfer.length > 0, 'number of journeys')
	for (const journey of journeysWithTransfer) t.doesNotThrow(() => validate(journey), 'valid fptf')
})

tape('flix.journeys opt.interval', async t => {
	const berlin = '1'
	const strasbourg = '23'

	const journeysWithoutInterval = await flix.journeys(berlin, strasbourg, { when, transfers: 0 })
	t.ok(journeysWithoutInterval.length === 1, 'number of journeys')
	for (const journey of journeysWithoutInterval) t.doesNotThrow(() => validate(journey), 'valid fptf')

	const journeysWithInterval = await flix.journeys(berlin, strasbourg, { when, transfers: 0, interval: 3 * 24 * 60 })
	t.ok(journeysWithInterval.length === 3, 'number of journeys')
	for (const journey of journeysWithInterval) t.doesNotThrow(() => validate(journey), 'valid fptf')
})
