let querystring = require("querystring")
let fetch = require("node-fetch");

const API_BASE = "https://api.github.com/search/users"

module.exports = githubClient


async function githubClient(params) {

    let queryString = querystring.stringify(params)
    let fetchUrl = `${API_BASE}?${queryString}`

    let options = {}

    if (process.env.GITHUB_API_TOKEN) {
        options.headers = {
            authorization: `token ${process.env.GITHUB_API_TOKEN}`
        }
    } else {
        console.warn("running without authorization, consider adding a GITHUB_API_TOKEN env variable")
    }

    let response = await fetch(fetchUrl, options)
    let results = await response.json()

    return results
}