let nunjucks = require("nunjucks")
let githubClient = require("./github.js")

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