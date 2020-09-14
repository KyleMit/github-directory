let querystring = require("querystring")
let fetch = require("node-fetch");

const API_BASE = "https://api.github.com/search/users"
const PAGE_SIZE = 10

module.exports = githubClient


async function githubClient(params) {
    // destructure params
    let searchTerm = params.q
    let curPage = +(params.p || 1)

    // sanitize incoming params
    let queryParams = {
        q: searchTerm,
        page: curPage,
        per_page: PAGE_SIZE
    }

    let queryString = querystring.stringify(queryParams)
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
                console.error(error.message)
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
                avatarUrl: `${avatarUrl}&s=181`,
                twitterUsername,
                followerCount,
                followingCount,
                repoCount,
                gistCount,
            }
            return output
        })

        let pagination = getPagination(total_count, curPage, PAGE_SIZE)

        let output = { total_count, searchTerm, incomplete_results, users, pagination }

        return output

    } catch (error) {
        console.error(`Encountered the following error when searching for '${searchTerm}'`, error.message)
        throw (error)

    }

}

function getPagination(totalCount, curPage, size) {

    let firstPage = 1
    let lastPage = Math.ceil(totalCount / size);
    let prevPage = curPage - 1
    let nextPage = curPage + 1

    let pagination = {
        showPagination: lastPage > 1,
        curPage,
    }

    // if we're not on the first page, include it
    if (curPage != firstPage) {
        pagination.firstPage = 1
    }

    // if we're not on the last page, include it
    if (curPage != lastPage) {
        pagination.lastPage = lastPage
    }

    // if prev page great than first page, include it
    if (prevPage > firstPage) {
        pagination.prevPage = prevPage
    }

    // if next page less than last page, include it
    if (nextPage < lastPage) {
        pagination.nextPage = nextPage
    }

    // if there's space between first and prev, add skip block
    if (prevPage - firstPage > 1) {
        pagination.skipToFirst = true
    }

    // if there's space between last and next, add skip block
    if (lastPage - nextPage > 1) {
        pagination.skipToLast = true
    }

    // we prefer rendering extremes, if delta is same as end, set arrow
    pagination.leftArrow = pagination.prevPage || pagination.firstPage
    pagination.rightArrow = pagination.nextPage || pagination.lastPage


    return pagination

}