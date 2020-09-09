# github-directory

Future Home of Github User Search


## Features

* [ ] I can search for users and see a paginated list of results
* [ ] I can navigate through the next and previous pages of the paginated results
* [ ] I see the total count of search results
* [ ] I see notable information for each search result, such as:
  * [ ] the description
  * [ ] star/follower count
  * [ ] profile pictures
  * [ ] etc.
* [ ] I can select a search result and be taken to the applicable page on github.com API

## Considerations

* Load Performance
  * SSR / SSG
* Client Performance
  * Debounce
* Accessibility
* Design
  * [Style](https://primer.style/css/)
    * Primary: #0366D6
  * Usability
  * Engagement
* Progressive Elaboration
  * No JS Fallback
  * Deep Link URLs
* Rate Limiting
  * Credentials
* Security
  * Injection Attack
* [Advanced Search](https://docs.github.com/en/github/searching-for-information-on-github/searching-users#search-only-users-or-organizations)
  * Typeahead?

## API

* [REST API v3](https://developer.github.com/v3/search/)
* [REST API](https://docs.github.com/en/rest/reference/search)
* [GitHub GraphQL API](https://docs.github.com/en/graphql)
* **Example**: https://api.github.com/search/users?q=KyleMit

### API Docs

* [Authentication](https://docs.github.com/en/rest/overview/other-authentication-methods#via-oauth-and-personal-access-tokens)
* [Link Header](https://developer.github.com/v3/#link-header)
  * Hypermedia as the Engine of Application State (**HATEOAS**)

### Third Party

* [Font Awesome](https://fontawesome.com/)
* [Undraw](https://undraw.co/)
* [Google Fonts](https://fonts.google.com/)

## Wireframes

* [Wireframes in Figma](https://www.figma.com/file/ROlxCsfRdOdYPJpQEs0aeB/Github-Directory)

## Prior Art

**Prior Art**: https://github.com/search
