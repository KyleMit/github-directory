let nunjucks = require("nunjucks")
let githubClient = require("./github-graphql.js")

module.exports = (function() {

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
        let term = event.queryStringParameters.q

        let data = {
            state,
            title: `Github search for ${term}`,
            description: `Github search for ${term}`,
            path: `/search?q=${encodeURIComponent(term)}`,
            url: "https://github.directory",
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