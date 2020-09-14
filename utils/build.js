let nunjucks = require("nunjucks")
let path = require('path');
let { promises: fs } = require("fs");
let { zipFunctions } = require('@netlify/zip-it-and-ship-it')
const appendZip = require("./appendZip")

main()

async function main() {

    // bundle lambda dependencies
    const archives = await zipFunctions('functions', 'functions-dist')
    let templateFunctions = ["results.zip", "search.zip"]
    let appendArchives = archives.filter(archive => {
        return templateFunctions.some(name => archive.path.endsWith(name))
    })


    // append templates and assets to function zips
    await Promise.all(appendArchives.map(async(zipPath) => {
        let fullPath = path.join(__dirname.replace("utils", ""), zipPath.path)
        await appendZip(fullPath, (archive) => {
            archive.directory('templates/', 'templates');
            archive.directory('assets/', 'assets');
        });
    }));


    // write index.html
    let data = {
        state: "clean",
        title: "Github Directory",
        description: "Github User Search",
        url: "https://github.directory",
        path: ""
    }
    let output = nunjucks.render("templates/index.njk", data)
    await fs.mkdir("_site", { recursive: true })
    await fs.writeFile("_site/index.html", output, "utf8")


    // migrate static assets
    await fs.copyFile("./assets/favicon.ico", "./_site/favicon.ico")
    await fs.copyFile("./assets/thumbnail.png", "./_site/thumbnail.png")

}