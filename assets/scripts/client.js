let updateResults = async function(e) {
    // don't post back form if we have JS
    e.preventDefault();

    var term = searchInput.value

    // fetch data
    var response = await fetch(`/api/results?q=${encodeURIComponent(term)}`);
    var results = await response.json();

    // insert html
    resultsSection.innerHTML = results.html;

    // update UI state
    let currentState = !term ? "clean" :
        results.total_count == 0 ? "empty" :
        "results"

    // set state
    document.body.setAttribute('data-state', currentState)

    // update url
    history.pushState({ q: "kyle" }, `Users with '${term}'`, `/search?q=${encodeURIComponent(term)}`)

}

// https://stackoverflow.com/a/61241621/1366033
let debounceEarly = function(func, wait) {
    var timeoutId;

    return function() {
        var context = this,
            args = arguments;

        var defer = function() { timeoutId = null; };
        var callNow = !timeoutId;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(defer, wait);

        if (callNow) func.apply(context, args);
    };
};

let updateResultsDebounced = debounceEarly(updateResults, 1000)

var searchInput = document.getElementById("search-input")
var form = document.getElementById("search-form")
var resultsSection = document.getElementById("results")

searchInput.addEventListener('input', updateResultsDebounced);
searchInput.addEventListener('change', updateResultsDebounced);
form.addEventListener('submit', updateResultsDebounced);