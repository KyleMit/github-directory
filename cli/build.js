let nunjucks = require("nunjucks")
let { promises: fs } = require("fs");

main()

async function main() {

    let output = nunjucks.render("templates/index.njk", { state: "clean" })

    await fs.mkdir("_site", { recursive: true })
    await fs.writeFile("_site/index.html", output, "utf8")

    await fs.copyFile("./assets/favicon.ico", "./_site/favicon.ico")

}