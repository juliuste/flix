'use strict'

const { fetch } = require('fetch-ponyfill')()
const { stringify } = require('query-string')

const endpoint = 'https://api.flixbus.com/mobile/v1/'

// keys & endpoints
// https://api.meinfernbus.de/mobile/v1: uR=s7k6m=[cCS^zY86H8CNAnkC6n
// https://api.flixbus.com/mobile/v1: k8LKgcuFoHnN5x/NdDYD6QSvjB4=
// keys seem to work for both (flix also works for mfb and vice versa)

const defaults = {
	apiKey: 'k8LKgcuFoHnN5x/NdDYD6QSvjB4=',
	userAgent: 'FlixBus/3.3 (iPhone; iOS 9.3.4; Scale/2.00)',
}

const request = async (route, opt, headers = {}, query = {}) => {
	query = stringify(query)

	opt = { ...defaults, ...opt }
	if (typeof opt.apiKey !== 'string' || !opt.apiKey) {
		throw new Error('`opt.apiKey` must be non-empty string')
	}
	if (typeof opt.userAgent !== 'string' || !opt.userAgent) {
		throw new Error('`opt.userAgent` must be non-empty string')
	}

	const url = `${endpoint}${route}?${query}`
	const res = await fetch(url, {
		headers: {
			'X-API-Authentication': opt.apiKey,
			'User-Agent': opt.userAgent,
			...headers,
		},
	})
	if (!res.ok) {
		const error = new Error(res.statusText)
		error.statusCode = res.status
		error.url = url
		throw error
	}
	return res.json()
}

request.features = { // required by fpti
	apiKey: 'Custom API key',
	userAgent: 'Custom User-Agent',
}

module.exports = request
