let githubClient = require("../utils/github-graphql.js")

exports.handler = async(event) => {
    let results = await githubClient(event.queryStringParameters)

    return {
        statusCode: 200,
        body: JSON.stringify(results)
    };
}