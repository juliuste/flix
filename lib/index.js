'use strict'

const stations = require('./stations')
const regions = require('./regions')
const journeys = require('./journeys')
const { departuresToday, arrivalsToday } = require('./timetable')
const trip = require('./trip')
const order = require('./order')

module.exports = {
	stations,
	regions,
	journeys,
	departuresToday,
	arrivalsToday,
	trip,
	order,
}
