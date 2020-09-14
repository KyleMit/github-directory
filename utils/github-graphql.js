let querystring = require("querystring")
let fetch = require("node-fetch");

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql"

module.exports = githubClient


async function githubClient(params) {
    let searchTerm = params.q

    let query = `
    {
        search(query: "${searchTerm}", type: USER, first: 10) {
          userCount
          edges {
            node {
              ... on User {
                id
                login
                name
                bio
                url
                avatarUrl(size: 120)
                twitterUsername
                followers {
                  totalCount
                }
                following {
                  totalCount
                }
                issues {
                  totalCount
                }
                repositories {
                  totalCount
                  totalDiskUsage
                }
                starredRepositories {
                  totalCount
                }
              }
            }
          }
        }
      }`

    let options = {
        method: "POST",
        'Content-Type': 'application/graphql',
        headers: {
            authorization: `token ${process.env.GITHUB_API_TOKEN}`
        },
        body: JSON.stringify({ query })
    }

    try {
        let response = await fetch(GRAPHQL_ENDPOINT, options)
        let results = await response.json()

        // etl
        let search = results.data.search

        // map nodes to user data
        let users = search.edges.map(edge => {
            let data = edge.node
            let { login, name, bio, url, avatarUrl, twitterUsername } = data
            let output = {
                login,
                name,
                bio,
                url,
                avatarUrl,
                twitterUsername,
                followerCount: data.followers.totalCount,
                followingCount: data.following.totalCount,
                repoCount: data.repositories.totalCount,
                starCount: data.starredRepositories.totalCount,
            }
            return output
        })

        // get properties
        let total_count = search.userCount
        let incomplete_results = users.length > total_count

        let output = { total_count, incomplete_results, users }

        return output

    } catch (error) {
        console.log(error)
        throw (error)

    }

}