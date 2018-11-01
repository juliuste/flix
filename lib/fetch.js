'use strict'

const { fetch } = require('fetch-ponyfill')()
const { stringify } = require('query-string')

const endpoint = 'https://api.flixbus.com/mobile/v1/'

// keys & endpoints
// https://api.meinfernbus.de/mobile/v1: uR=s7k6m=[cCS^zY86H8CNAnkC6n
// https://api.flixbus.com/mobile/v1: k8LKgcuFoHnN5x/NdDYD6QSvjB4=
// keys seem to work for both (flix also works for mfb and vice versa)

const request = async (route, headers = {}, query = {}) => {
	query = stringify(query)
	const res = await fetch(`${endpoint}${route}?${query}`, { headers })
	if (!res.ok) {
		const error = new Error(res.statusText)
		error.statusCode = res.status
		throw error
	}
	return res.json()
}

module.exports = request
