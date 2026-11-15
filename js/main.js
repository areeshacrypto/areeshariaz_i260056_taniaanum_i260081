/* =====================================================================
   CONVENE – main.js (loaded on every page)
   Each block starts with `if (element exists)` so one file can serve
   all pages without errors on pages that don't have that element.
   ===================================================================== */

// ===== 1. DARK / LIGHT MODE =====
// Bootstrap changes all its colours when data-bs-theme on <html> is "dark".
const html = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme") || "light";   // remembered between pages/visits
html.setAttribute("data-bs-theme", savedTheme);

if (themeBtn) {
  themeBtn.textContent = savedTheme === "dark" ? "Light mode" : "Dark mode";

  themeBtn.addEventListener("click", function () {
    const newTheme = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);                    // save choice
    themeBtn.textContent = newTheme === "dark" ? "Light mode" : "Dark mode";
  });
}

// ===== 2. COUNTDOWN (home page) =====
if (document.getElementById("days")) {
  const target = new Date("2026-12-12T18:00:00");              // Cultural Night

  function updateCountdown() {
    let diff = target - new Date();                             // milliseconds left
    if (diff < 0) diff = 0;
    document.getElementById("days").textContent  = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("hours").textContent = Math.floor(diff / (1000 * 60 * 60)) % 24;
    document.getElementById("mins").textContent  = Math.floor(diff / (1000 * 60)) % 60;
    document.getElementById("secs").textContent  = Math.floor(diff / 1000) % 60;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);                           // run again every second
}

// ===== 3. STAT COUNT-UP (home page) – NEW =====
// Each <strong data-count="6"> counts from 0 up to its data-count value.
document.querySelectorAll(".stat strong[data-count]").forEach(function (el) {
  const end = Number(el.dataset.count);
  let n = 0;
  const timer = setInterval(function () {
    n++;
    el.textContent = n;
    if (n >= end) clearInterval(timer);                         // stop at the target number
  }, 120);
});

// ===== 4. EVENT FILTER + SEARCH (events page) =====
// One function decides what is visible, using BOTH the category button and the search text.
const filterButtons = document.querySelectorAll(".filter");
const searchBox = document.getElementById("search");
let chosenCategory = "all";

function applyFilters() {
  const text = searchBox ? searchBox.value.trim().toLowerCase() : "";
  let shown = 0;

  document.querySelectorAll(".event").forEach(function (event) {
    const matchesCategory = chosenCategory === "all" || event.dataset.category === chosenCategory;
    const matchesText = event.textContent.toLowerCase().includes(text);   // search title/venue/date
    if (matchesCategory && matchesText) {
      event.style.display = "";                                 // show
      shown++;
    } else {
      event.style.display = "none";                             // hide
    }
  });

  const count = document.getElementById("resultCount");
  if (count) count.textContent = "Showing " + shown + (shown === 1 ? " event" : " events");
  const empty = document.getElementById("emptyMsg");
  if (empty) empty.classList.toggle("d-none", shown !== 0);     // "no events found" message
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    chosenCategory = button.dataset.filter;                     // "all", "academic", ...
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    button.classList.add("active");                             // ring on the clicked button
    applyFilters();
  });
});
if (searchBox) searchBox.addEventListener("input", applyFilters);   // re-filter on every keystroke

// ===== 5. EVENT DETAILS MODAL (events page) =====
// When the modal opens, copy the clicked button's data-* values into it.
const modal = document.getElementById("eventModal");
if (modal) {
  modal.addEventListener("show.bs.modal", function (e) {
    const button = e.relatedTarget;                             // the button that was clicked
    document.getElementById("mTitle").textContent = button.dataset.title;
    document.getElementById("mDate").textContent  = "Date: " + button.dataset.date;
    document.getElementById("mVenue").textContent = "Venue: " + button.dataset.venue;
    document.getElementById("mInfo").textContent  = button.dataset.info;
  });
}

// ===== 6. CONTACT FORM VALIDATION (contact page) =====
const form = document.getElementById("form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();                                         // stop the page from reloading
    let ok = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const date = document.getElementById("eventDate");
    const message = document.getElementById("message");
    const errors = document.querySelectorAll(".error");
    errors.forEach(function (x) { x.textContent = ""; });       // clear old errors

    if (name.value.trim() === "") { errors[0].textContent = "Please enter your name."; ok = false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;          // something@something.something
    if (!emailPattern.test(email.value.trim())) { errors[1].textContent = "Please enter a valid email."; ok = false; }

    if (date.value === "" || new Date(date.value) <= new Date()) { errors[2].textContent = "Please pick a future date."; ok = false; }

    if (message.value.trim() === "") { errors[3].textContent = "Please write a message."; ok = false; }

    if (ok) {
      document.getElementById("success").classList.remove("d-none");   // show success message
      form.reset();
      const counter = document.getElementById("charCount");
      if (counter) counter.textContent = "0 / 300";
    }
  });
}

// Live character counter under the message box – NEW
const messageBox = document.getElementById("message");
const charCount = document.getElementById("charCount");
if (messageBox && charCount) {
  messageBox.addEventListener("input", function () {
    charCount.textContent = messageBox.value.length + " / 300";  // maxlength="300" stops typing at 300
  });
}

// ===== 7. SCROLL REVEAL (all pages) =====
// IntersectionObserver tells us when an element enters the screen; we then add .visible
// and the CSS transition fades it in. unobserve() = animate only once.
const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
