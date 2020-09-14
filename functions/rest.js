let githubClient = require("../utils/github-rest.js")

exports.handler = async(event) => {
    let results = await githubClient(event.queryStringParameters)

    return {
        statusCode: 200,
        body: JSON.stringify(results, null, 2)
    };
}