'use strict'

const tape = require('tape')
const isEqual = require('lodash.isequal')
const isDate = require('lodash.isdate')
const validate = require('validate-fptf')

const meinfernbus = require('./index')

tape('meinfernbus.stations', (t) => {
	meinfernbus.stations().then((s) => {
		t.ok(s.length > 30, 'stations length')

		// for(let station of s) validate(station)

		const berlin = s.filter((x) => x.id === '1')[0]
		t.ok(berlin.type === 'station', 'stations berlin type')
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

		// for(let region of r) validate(region)

		const berlin = r.filter((x) => x.id === '88')[0]
		t.ok(berlin.type === 'region', 'regions berlin type')
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

tape('meinfernbus.journeys', (t) => {
	meinfernbus.journeys({id: '88', type: 'region'}, {id: '96', type: 'region'}).then((j) => {
		t.plan(15)
		t.ok(j.length > 1, 'journeys length')
		const journey = j[0]
		t.ok(journey.type === 'journey', 'journeys journey type')
		t.ok(journey.id, 'journeys journey id')
		t.ok(isBerlin(journey.origin), 'journeys journey origin')
		t.ok(isFrankfurt(journey.destination), 'journeys journey destination')
		t.ok(isDate(journey.departure), 'journeys journey departure')
		t.ok(isDate(journey.arrival), 'journeys journey arrival')
		t.ok(isBerlin(journey.legs[0].origin), 'journeys journey leg origin')
		t.ok(isFrankfurt(journey.legs[journey.legs.length-1].destination), 'journeys journey leg destination')
		t.ok(isDate(journey.legs[0].departure), 'journeys journey leg departure')
		t.ok(isDate(journey.legs[0].arrival), 'journeys journey leg arrival')
		t.ok(journey.legs[0].operator.type === 'operator', 'journeys journey leg operator type')
		t.ok(journey.legs[0].operator.id === 'mfb', 'journeys journey leg operator id')
		t.ok(journey.price.currency === 'EUR', 'journey price currency')
		t.ok(journey.price.amount > 0 || journey.price.available === false, 'journey price amount')
	})
})
