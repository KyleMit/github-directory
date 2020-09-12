let nunjucks = require("nunjucks")
let querystring = require("querystring")
let fetch = require("node-fetch");

const API_BASE = "https://api.github.com/search/users"

module.exports = (function() {


    // https://api.github.com/search/users?q=type:user
    // http://localhost:8888/.netlify/functions/search
    // http://localhost:8888/api/search
    let githubClient = async function(params) {

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

    let results = async(event, context) => {

        let results = await githubClient(event.queryStringParameters)
        let { total_count, items, incomplete_results } = results

        let html = nunjucks.render("templates/results.njk", { results })

        let output = {
            html,
            queryParams: event.queryStringParameters,
            total_count,
            incomplete_results
        }

        return {
            statusCode: 200,
            body: JSON.stringify(output)
        };
    }

    let search = async(event, context) => {

        let results = await githubClient(event.queryStringParameters)

        let state = results.total_count == 0 ? "empty" : "results"

        let data = {
            state,
            results
        }

        let html = nunjucks.render("templates/index.njk", data)

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: html
        };
    }

    return {
        results,
        search
    }

})()