let querystring = require("querystring")
let fetch = require("node-fetch");

const API_BASE = "https://api.github.com/search/users"

module.exports = githubClient


async function githubClient(params) {
    params.per_page = 10

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

    try {
        let response = await fetch(fetchUrl, options)
        let results = await response.json()

        // etl data
        let { total_count, incomplete_results, items: users } = results

        let users = results.items.map(item => {
            // replace item name for consistency with graphQL
            item.url = item.html_url
            return item;
        })

        let output = { total_count, incomplete_results, users }

        return output

    } catch (error) {
        console.log(error)
        throw (error)

    }

}