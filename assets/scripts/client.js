//iife
(function() {

    // save elements
    let searchInput = document.getElementById("search-input")
    let form = document.getElementById("search-form")
    let resultsSection = document.getElementById("results")
    let footer = document.getElementById("footer")

    let handleScroll = function(e) {
        let footerHeight = footer.clientHeight
        let winHeight = window.innerHeight
        let winScroll = window.pageYOffset
        let winOffset = winHeight + winScroll + footerHeight
        let bodyOffset = document.body.offsetHeight
        let atBottom = winOffset >= bodyOffset
            // console.log({ winHeight, winScroll, winOffset, bodyOffset })

        document.body.classList.toggle("page-bottom", atBottom)
    };

    let updateResults = async function(e) {
        // don't post back form if we have JS
        e.preventDefault();

        let term = searchInput.value


        // fetch data
        let response = await fetch(`/api/results?q=${encodeURIComponent(term)}`);
        let results = await response.json();


        // todo - check for  auth failure

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
    let debounceEarly = function(func, wait) {
        let timeoutId;

        return function() {
            let context = this,
                args = arguments;

            let defer = function() { timeoutId = null; };
            let callNow = !timeoutId;

            clearTimeout(timeoutId);
            timeoutId = setTimeout(defer, wait);

            if (callNow) func.apply(context, args);
        };
    };

    let addHandlers = function() {

        let updateResultsDebounced = debounceEarly(updateResults, 1000)

        try {

            window.onscroll = handleScroll

            searchInput.addEventListener('input', updateResultsDebounced);
            searchInput.addEventListener('change', updateResultsDebounced);
            form.addEventListener('submit', updateResultsDebounced);

        } catch (error) {
            console.log(error)
            document.body.setAttribute('data-state', "error")
        }
    }

    // add handlers
    addHandlers()


})()