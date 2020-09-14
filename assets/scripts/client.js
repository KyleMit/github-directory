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

        let term = searchInput.value.trim();

        // reset ui if backed out
        if (!term) {
            // reset url
            history.pushState({}, `Github Directory`, `/`)
            document.body.setAttribute('data-state', "clean")
            return;
        }

        let results;
        try {

            // fetch data
            let response = await fetch(`/api/results?q=${encodeURIComponent(term)}`);
            results = await response.json();

        } catch (error) {
            // todo - check for  auth failure
            console.log(error)
            document.body.setAttribute('data-state', "error")
            history.pushState({}, `Github Directory`, `/`)
            return;
        }


        // insert html
        resultsSection.innerHTML = results.html;

        // update UI state
        let currentState = results.total_count == 0 ? "empty" : "results"

        // set state
        document.body.setAttribute('data-state', currentState)

        // update url
        history.pushState({ q: "kyle" }, `Users with '${term}'`, `/search?q=${encodeURIComponent(term)}`)


    }

    // https://stackoverflow.com/a/61241621/1366033
    function debounceLate(func, wait) {
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


    let addHandlers = function() {

        let updateResultsDebounced = debounceLate(updateResults, 600)

        try {

            window.onscroll = handleScroll

            searchInput.addEventListener('input', updateResultsDebounced);
            searchInput.addEventListener('change', updateResultsDebounced);
            searchInput.addEventListener('keyup', updateResultsDebounced);
            form.addEventListener('submit', updateResultsDebounced);

        } catch (error) {
            console.log(error)
            document.body.setAttribute('data-state', "error")
        }
    }

    // add handlers
    addHandlers()


})()