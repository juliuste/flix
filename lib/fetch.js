'use strict'

const { fetch } = require('fetch-ponyfill')({ Promise: require('pinkie-promise') })
const qs = require('querystring')

const endpoint = 'https://api.flixbus.com/mobile/v1/'

// keys & endpoints
// https://api.meinfernbus.de/mobile/v1: uR=s7k6m=[cCS^zY86H8CNAnkC6n
// https://api.flixbus.com/mobile/v1: k8LKgcuFoHnN5x/NdDYD6QSvjB4=
// keys seem to work for both (flix also works for mfb and vice versa)

const request = (route, headers = {}, query = {}) => {
	query = qs.stringify(query)
	return fetch(endpoint + route + '?' + query, { headers })
		.then((res) => {
			if (!res.ok) {
				const err = new Error(res.statusText)
				err.statusCode = res.status
				throw err
			}

			return res.json()
		})
}

module.exports = request
