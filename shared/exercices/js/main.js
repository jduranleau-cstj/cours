import { initLatex, initHighlight } from "../../js/utils.js"

const params = new URLSearchParams(document.location.search)
const file = params.get("f")

if (!file) {
    window.history.back()
}

const hash = document.location.hash.replace("#", "")

const labs_html = await fetch(`../../cours/${file}`).then(r => r.text())

document.querySelector(".container").innerHTML = labs_html

initLatex()
initHighlight()