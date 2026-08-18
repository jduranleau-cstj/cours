import { initLatex, initHighlight } from "../../js/utils.js"

const params = new URLSearchParams(document.location.search)
const file = params.get("f")

if (!file) {
    window.history.back()
}

const slides_html = await fetch(`../../cours/${file}`).then(r => r.text())
document.querySelector(".slides").innerHTML = slides_html

const prev_bt = document.querySelector(".prev-slide")
const next_bt = document.querySelector(".next-slide")
const slides = document.querySelectorAll(".slide")
const focus_overlay = document.querySelector(".focus-overlay")

const mouse = {
    x: 0,
    y: 0,
}

const hash = document.location.hash.replace("#", "")

let current_active = null
let current_index = parseInt(hash) || 0
let focus_overlay_enabled = false

prev_bt.addEventListener("click", prevSlide)
next_bt.addEventListener("click", nextSlide)

window.addEventListener("keydown", keydownHandler)
window.addEventListener("keyup", keyupHandler)
window.addEventListener("mousemove", mousemoveHandler)

initLatex()
initHighlight()

showSlide(current_index)
updateFocusOverlay(0)

initDebug()

function showSlide(index) {
    if (current_active) {
        current_active.classList.remove("active")
    }

    // Set current slide as active
    current_index = index
    current_active = slides[current_index]
    current_active.classList.add("active")

    // Disable left button when needed
    if (current_index === 0) {
        prev_bt.classList.add("disabled")
    } else {
        prev_bt.classList.remove("disabled")
    }

    // Disable right button when needed
    if (current_index === slides.length - 1) {
        next_bt.classList.add("disabled")
    } else {
        next_bt.classList.remove("disabled")
    }

    window.location.hash = `${current_index}`
}

function prevSlide() {
    if (current_index === 0) return
    showSlide(current_index - 1)
}

function nextSlide() {
    if (current_index === slides.length - 1) return
    showSlide(current_index + 1)
}

function keydownHandler(e) {
    if (e.key === "ArrowLeft") {
        prevSlide()
    }
    if (e.key === "ArrowRight") {
        nextSlide()
    }
    if (e.key === "Shift") {
        focus_overlay_enabled = true
    }
}

function keyupHandler(e) {
    if (e.key === "Shift") {
        focus_overlay_enabled = false
    }
}

function mousemoveHandler(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
}

function updateFocusOverlay(time) {
    focus_overlay.style.display = (focus_overlay_enabled) ? "block" : "none"
    focus_overlay.style.mask = `radial-gradient(circle 5rem at ${mouse.x}px ${mouse.y}px, rgb(0 0 0 / 0) 99%,  rgb(0,0,0) 100%)`

    requestAnimationFrame(updateFocusOverlay)
}

function initDebug() {
    if (window.location.href.indexOf("?debug") !== -1) {
        document.body.classList.add("show-all")
    }
}