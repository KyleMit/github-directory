let querystring = require("querystring")
let fetch = require("node-fetch");

const API_BASE = "https://api.github.com/search/users"

module.exports = githubClient


async function githubClient(params) {
    params.per_page = 10

    let queryString = querystring.stringify(params)
    let searchUrl = `${API_BASE}?${queryString}`

    let options = {}

    if (process.env.GITHUB_API_TOKEN) {
        options.headers = {
            authorization: `token ${process.env.GITHUB_API_TOKEN}`
        }
    } else {
        console.warn("running without authorization, consider adding a GITHUB_API_TOKEN env variable")
    }

    try {
        let response = await fetch(searchUrl, options)
        let results = await response.json()

        // get supplemental data
        let userQueries = results.items.map(data => data.url)

        let userResults = await Promise.all(userQueries.map(async(userUrl) => {
            try {
                let response = await fetch(userUrl, options)
                let results = await response.json()
                return results;
            } catch (error) {
                // possible username encoding trouble ie.
                // https://github.com/K
                // https://apps.timwhitlock.info/unicode/inspect?s=%E2%84%AA
                // even github can't render, catch and move on
                console.log(error)
            }

        }));


        // destructure search results
        let { total_count, incomplete_results } = results

        let users = userResults.filter(u => u).map(user => {
            // destructure user
            let {
                login,
                name,
                bio,
                twitter_username: twitterUsername,
                avatar_url: avatarUrl,
                html_url: url,
                public_repos: repoCount,
                public_gists: gistCount,
                followers: followerCount,
                following: followingCount
            } = user

            // build output
            let output = {
                login,
                name,
                bio,
                url,
                avatarUrl: `${avatarUrl}&s=120`,
                twitterUsername,
                followerCount,
                followingCount,
                repoCount,
                gistCount,
            }
            return output
        })

        let output = { total_count, incomplete_results, users }

        return output

    } catch (error) {
        console.log(error)
        throw (error)

    }

}