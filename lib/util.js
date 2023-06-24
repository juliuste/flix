'use strict'

const moment = require('moment-timezone')
const slug = require('slugg')

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

const parseCountry = (country) => {
	if (!country) return null
	return {
		name: normalizeEmpty(country.name),
		code: normalizeEmpty(country.alpha2_code),
	}
}

const parseStation = (s) => ({
	...parseSparseStation(s),
	location: {
		type: 'location',
		longitude: normalizeEmpty(s.coordinates.longitude),
		latitude: normalizeEmpty(s.coordinates.latitude),
		address: normalizeEmpty(s.full_address),
		street: normalizeEmpty(s.address),
		zip: normalizeEmpty(s.zip),
		country: parseCountry(s.country),
		notes: normalizeEmpty(s.warnings),
	},
	importance: Number.isInteger(s.importance_order) ? normalizeEmpty(+s.importance_order) : null,
})

const parseOperator = (o) => ({
	type: 'operator',
	id: o.key ? o.key : (o.label ? slug(o.label) : null),
	name: o.label,
	url: normalizeEmpty(o.url),
	address: normalizeEmpty(o.address),
})

const parseWhen = (keys, data, cancelled = false) => {
	let plannedWhen = (keys.planned && data[keys.planned]) || null
	if (plannedWhen) {
		plannedWhen = parseDateTime(plannedWhen)
	}
	let prognosedWhen = (keys.prognosed && data[keys.prognosed]) || null
	if (prognosedWhen && prognosedWhen.eta) {
		prognosedWhen = parseDateTime(prognosedWhen.eta)
	}
	const delay = plannedWhen && prognosedWhen
		? Math.round((new Date(prognosedWhen) - new Date(plannedWhen)) / 1000)
		: null

	if (cancelled) {
		return {
			when: null,
			plannedWhen,
			prognosedWhen,
			delay,
		}
	}
	return {
		when: prognosedWhen || plannedWhen,
		plannedWhen,
		delay,
	}
}

module.exports = {
	formatDateTime,
	parseDateTime,
	normalizeEmpty,
	parseSparseStation,
	parseStation,
	parseOperator,
	parseWhen,
}
