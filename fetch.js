'use strict'

const fetch = require('isomorphic-fetch')
const qs = require('querystring')



const request = (route, headers, query) => {
	headers = new Headers(headers)
	query = qs.stringify(query)
	return fetch('http://api.meinfernbus.de/mobile/v1/'+ route + '?' + query, {headers})
	.then((res) => {
		if (res.status === 304) return res
		return res.json().then((parsed) => {
			res.body = parsed
			return res
		})
	}, (res) => {throw res})
}

module.exports = request
