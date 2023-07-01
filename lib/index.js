'use strict'

const stations = require('./stations')
const regions = require('./regions')
const journeys = require('./journeys')
const { departuresToday, arrivalsToday } = require('./timetable')

module.exports = {
	stations,
	regions,
	journeys,
	departuresToday,
	arrivalsToday
}
