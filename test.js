'use strict'

const tape = require('tape')
const isEqual = require('lodash.isequal')
const validate = require('validate-fptf')
const moment = require('moment-timezone')
const isURL = require('is-url-superb')

const meinfernbus = require('./index')

const when = moment.tz('Europe/Berlin').day(10).startOf('day').add('6', 'hour').toDate() // next tuesday, 06:00

tape('meinfernbus.stations', (t) => {
	meinfernbus.stations().then((s) => {
		t.ok(s.length > 30, 'stations length')

		for(let station of s) validate(station)

		const berlin = s.filter((x) => x.id === '1')[0]
		t.ok(berlin.id === '1', 'stations berlin id')
		t.ok(berlin.name === 'Berlin central bus station', 'stations berlin name')
		t.ok(berlin.location.street === 'Masurenallee 4-6', 'stations berlin street')
		t.ok(berlin.location.zip === '14057', 'stations berlin zip')
		t.ok(berlin.location.address === 'Masurenallee 4-6, 14057 Berlin, Germany', 'stations berlin address')
		t.ok(isEqual(berlin.location.country, {name: 'Germany', code: 'DE'}), 'stations berlin country')
		t.ok(berlin.aliases.length >= 0, 'stations berlin aliases')
		t.ok(isEqual(berlin.regions, ['88']), 'stations berlin regions')
		t.ok(berlin.connections.length > 20, 'stations berlin connections')
		t.ok(berlin.slug === 'berlin-zob', 'stations berlin slug')
		t.end()
	})
})

tape('meinfernbus.regions', (t) => {
	meinfernbus.regions().then((r) => {
		t.ok(r.length > 30, 'regions length')

		for(let region of r) validate(region)

		const berlin = r.filter((x) => x.id === '88')[0]
		t.ok(berlin.id === '88', 'regions berlin id')
		t.ok(berlin.name === 'Berlin', 'regions berlin name')
		t.ok(isEqual(berlin.location.country, {name: 'Germany', code: 'DE'}), 'regions berlin country')
		t.ok(berlin.class === 'A', 'regions berlin class')
		t.ok(berlin.stations.length > 4, 'regions berlin stations')
		t.ok(berlin.connections.length > 20, 'regions berlin connections')
		t.ok(berlin.slug === 'berlin', 'regions berlin slug')
		t.end()
	})
})

const isBerlin = (s) => (s.type==='station' && s.name.substr(0, 6) === 'Berlin')
const isFrankfurt = (s) => (s.type==='station' && s.name.substr(0, 9) === 'Frankfurt')
const isStuttgart = (s) => (s.type==='station' && s.name.substr(0, 9) === 'Stuttgart')

tape('meinfernbus.journeys bus', (t) => {
	// Berlin -> Frankfurt
	meinfernbus.journeys({id: '88', type: 'region'}, {id: '96', type: 'region'}, when).then((j) => {
		t.ok(j.length > 1, 'journeys length')

		for(let journey of j) validate(journey)

		const journey = j[0]
		t.ok(isBerlin(journey.legs[0].origin), 'leg origin')
		t.ok(isFrankfurt(journey.legs[journey.legs.length-1].destination), 'leg destination')
		t.ok(journey.legs.every(l => l.mode === 'bus'), 'leg mode')
		t.ok(journey.legs.every(l => l.operator.id === 'mfb'), 'leg operator id')
		t.ok(journey.price.currency === 'EUR', 'price currency')
		t.ok(isURL(journey.price.url), 'price url')
		t.end()
	})
})

tape('meinfernbus.journeys train', (t) => {
	// Berlin -> Stuttgart
	meinfernbus.journeys({id: '88', type: 'region'}, {id: '101', type: 'region'}, when).then((j) => {
		t.ok(j.length > 1, 'journeys length')

		for(let journey of j) validate(journey)

		// journey with 1 leg, starting at Berlin-Lichtenberg
		const journey = j.find(x => x.legs.length === 1 && x.legs[0].origin.id === '20718')
		t.ok(!!journey, 'journey')
		t.ok(isBerlin(journey.legs[0].origin), 'leg origin')
		t.ok(isStuttgart(journey.legs[journey.legs.length-1].destination), 'leg destination')
		t.ok(journey.legs.every(l => l.mode === 'train'), 'leg mode')
		t.ok(journey.legs.every(l => l.operator.id === 'leoloco'), 'leg operator id')
		t.ok(journey.price.currency === 'EUR', 'price currency')
		t.ok(isURL(journey.price.url), 'price url')
		t.end()
	})
})
