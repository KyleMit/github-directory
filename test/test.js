require("dotenv").config()
var assert = require('assert');



describe('functions', function() {

    it('should return body property', async function() {
        // arrange
        let results = require("../utils/api.js").results
        let event = { queryStringParameters: { q: "kyle" } }

        // act
        let result = await results(event)

        //console.log(actual)

        // assert
        assert.ok(result.hasOwnProperty("body"));

    });

});

describe('github-rest', function() {

    it('should return total_count property', async function() {
        // arrange
        let githubClient = require("../utils/github-rest.js")
        let params = { q: "kyle" }

        // act
        let result = await githubClient(params)

        // console.log(result)

        // assert
        assert.ok(result.hasOwnProperty("total_count"));

    });

});