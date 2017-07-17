'use strict'

const tape = require('tape')
const isEqual = require('lodash.isequal')
const meinfernbus = require('./index')

tape('meinfernbus.stations', (t) => {
	meinfernbus.stations().then((s) => {
		t.plan(1)
		t.ok(s.length > 50, 'stations length')
	})
})

tape('meinfernbus.stations.cities', (t) => {
	meinfernbus.stations.cities().then((c) => {
		t.plan(11)
		t.ok(c.length > 30, 'stations.cities length')
		const berlin = c.filter((x) => x.id === 88)[0]
		t.ok(berlin.type === 'station', 'stations.cities berlin type')
		t.ok(berlin.subtype === 'city', 'stations.cities berlin subtype')
		t.ok(berlin.id === 88, 'stations.cities berlin id')
		t.ok(berlin.name === 'Berlin', 'stations.cities berlin name')
		t.ok(berlin.coordinates && berlin.coordinates.latitude && berlin.coordinates.longitude, 'stations.cities berlin coordinates')
		t.ok(isEqual(berlin.country, {name: 'Germany', code: 'DE'}), 'stations.cities berlin country')
		t.ok(berlin.class === 'A', 'stations.cities berlin class')
		t.ok(berlin.stations.length > 4, 'stations.cities berlin stations')
		t.ok(berlin.connections.length > 20, 'stations.cities berlin connections')
		t.ok(berlin.slug === 'berlin', 'stations.cities berlin slug')
	})
})

tape('meinfernbus.stations.stations', (t) => {
	meinfernbus.stations.stations().then((s) => {
		t.plan(14)
		t.ok(s.length > 30, 'stations.stations length')
		const berlin = s.filter((x) => x.id === 1)[0]
		t.ok(berlin.type === 'station', 'stations.stations berlin type')
		t.ok(berlin.subtype === 'station', 'stations.stations berlin subtype')
		t.ok(berlin.id === 1, 'stations.stations berlin id')
		t.ok(berlin.name === 'Berlin central bus station', 'stations.stations berlin name')
		t.ok(berlin.street === 'Masurenallee 4-6', 'stations.stations berlin street')
		t.ok(berlin.zip === '14057', 'stations.stations berlin zip')
		t.ok(berlin.address === 'Masurenallee 4-6, 14057 Berlin, Germany', 'stations.stations berlin address')
		t.ok(berlin.coordinates && berlin.coordinates.latitude && berlin.coordinates.longitude, 'stations.stations berlin coordinates')
		t.ok(berlin.aliases.length >= 0, 'stations.stations berlin aliases')
		t.ok(isEqual(berlin.country, {name: 'Germany', code: 'DE'}), 'stations.stations berlin country')
		t.ok(berlin.city === 88, 'stations.stations berlin city')
		t.ok(berlin.connections.length > 20, 'stations.stations berlin connections')
		t.ok(berlin.slug === 'berlin-zob', 'stations.stations berlin slug')
	})
})
