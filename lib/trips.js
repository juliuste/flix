const got = require('got')
const moment = require('moment-timezone')

const err = (error) => {throw error}


const formatInputDate = (date) => moment(date).tz('Europe/Berlin').format('DD.MM.YYYY')
const formatOutputDate = (date) => moment.unix(+date.timestamp).utcOffset(date.tz)
const formatDuration = (duration) => (+duration.hour*60)+(+duration.minutes)

const m = (a) => ((a===undefined) ? null : a)

const defaults = {
	adults: 1,
	children: 0,
	bikes: 0,
	currency: 'EUR',
	search_by: 'cities',
	back: 0, // ???
}

const parseTransfer = (transfer) => ({
	station: {
		id: transfer.station_id,
		name: m(transfer.station_name)
	},
	arrival: formatOutputDate(transfer.arrival),
	departure: formatOutputDate(transfer.departure),
	duration: formatDuration(transfer.duration),
	shuttle: m(transfer.shuttle_transfer),
	message: m(transfer.message)
})

const parseTrip = (from, to) => (trip) => ({
	from: from,
	to: to,
	id: m(trip.id), // ???
	rides: m(trip.rides_uids), // ???
	type: m(trip.type), // direct / interconnection
	departure: formatOutputDate(trip.departure),
	arrival: formatOutputDate(trip.arrival),
	duration: formatDuration(trip.duration),
	status: m(trip.status),
	borders: m(trip.transborder),
	available: m(trip.available),
	operators: m(trip.operated_by),
	transfers: (trip.interconnection_transfers ? trip.interconnection_transfers.map(parseTransfer) : null),
	sale_restriction: m(trip.sale_restriction), // ???
	discounts: m(trip.discounts), // ???
	price: m(trip.price_total_sum),
	info: {
		title: m(trip.info_title),
		hint: m(trip.info_title_hint),
		message: m(trip.info_message)
	},
	warnings: m(trip.warnings)
})

const parseTrips = (trips) => {
	result = []
	for(trip of trips){
		result = result.concat(trip.items.map(parseTrip(trip.from, trip.to)))
	}
	return result
}



const trips = (from, to, date, opt) => {
	opt = Object.assign({}, defaults, opt || {})
	return got('http://api.meinfernbus.de/mobile/v1/trip/search.json', {json: true, headers: {
		'X-API-Authentication': 'uR=s7k6m=[cCS^zY86H8CNAnkC6n',
		'User-Agent': 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)',
		'X-User-Country': 'de'
	}, query: {
		from: +from,
		to: +to,
		departure_date: formatInputDate(date),
		return_date: null,
		back: +opt.back,
		search_by: opt.search_by,
		currency: opt.currency,
		adult: +opt.adults,
		children: +opt.children,
		bikes: +opt.bikes
	}}).then((res) => {return parseTrips(res.body.trips)},err)
}

module.exports = trips