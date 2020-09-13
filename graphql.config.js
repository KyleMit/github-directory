// graphql.config.js
module.exports = {
    schema: ["src/schema.graphql", "my/directives.graphql"],
    documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
    extensions: {
        endpoints: {
            default: {
                url: "https://api.github.com/graphql",
                headers: { Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}` },
            },
        },
    }
}