// https://api.github.com/search/users?q=type:user
// http://localhost:8888/.netlify/functions/search
// http://localhost:8888/api/search

const API_BASE = "https://api.github.com/search/users"
let querystring = require("querystring")
let fetch = require("node-fetch");

exports.handler = async(event, context) => {

    let queryParams = event.queryStringParameters
    let queryString = querystring.stringify(queryParams)

    let response = await fetch(
        `${API_BASE}?${queryString}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_TOKEN}`
            }
        }
    )
    let result = await response.json()

    console.log(result)

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
}