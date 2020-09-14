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
    if (term) {
        history.pushState({ q: "kyle" }, `Users with '${term}'`, `/search?q=${encodeURIComponent(term)}`)
    } else {
        // reset url
        history.pushState({}, `Github Directory`, `/`)
    }


}

// https://stackoverflow.com/a/61241621/1366033
function debounce(func, wait) {
    var timeoutId;

    return function() {
        var context = this,
            args = arguments;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
};

let updateResultsDebounced = debounce(updateResults, 1000)

var searchInput = document.getElementById("search-input")
var form = document.getElementById("search-form")
var resultsSection = document.getElementById("results")

searchInput.addEventListener('input', updateResultsDebounced);
searchInput.addEventListener('change', updateResultsDebounced);
form.addEventListener('submit', updateResultsDebounced);