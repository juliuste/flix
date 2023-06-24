'use strict'

const moment = require('moment-timezone')

const formatDateTime = (date) => {
	return moment(date).tz('Europe/Berlin').format('DD.MM.YYYY')
}

const parseDateTime = (date) => {
	return moment.unix(+date.timestamp).utcOffset(date.tz).format()
}

const normalizeEmpty = (val) => {
	return (val === undefined || val === '') ? null : val
}

const parseSparseStation = (s) => ({
	type: 'station',
	id: s.id + '',
	name: normalizeEmpty(s.name),
})

const parseStation = (s) => ({
	...parseSparseStation(s),
	location: {
		type: 'location',
		longitude: normalizeEmpty(s.coordinates.longitude),
		latitude: normalizeEmpty(s.coordinates.latitude),
		address: normalizeEmpty(s.full_address),
		street: normalizeEmpty(s.address),
	},
	importance: Number.isInteger(s.importance_order) ? normalizeEmpty(+s.importance_order) : null,
})

module.exports = {
	formatDateTime,
	parseDateTime,
	normalizeEmpty,
	parseSparseStation,
	parseStation,
}
