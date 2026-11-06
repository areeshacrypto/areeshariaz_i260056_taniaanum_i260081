// ===== 1. DARK / LIGHT MODE =====
// Bootstrap 5.3 changes all its colors when <html data-bs-theme="dark">.
const html = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

html.setAttribute("data-bs-theme", localStorage.getItem("theme") || "light");  // remember choice
themeBtn.textContent = html.getAttribute("data-bs-theme") === "dark" ? "Light mode" : "Dark mode";

themeBtn.addEventListener("click", function () {
  const newTheme = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeBtn.textContent = newTheme === "dark" ? "Light mode" : "Dark mode";
});

// ===== 2. COUNTDOWN (only runs on the Welcome page) =====
if (document.getElementById("days")) {
  const target = new Date("2026-12-12T18:00:00");

  function updateCountdown() {
    let diff = target - new Date();          // milliseconds left
    if (diff < 0) diff = 0;
    document.getElementById("days").textContent  = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("hours").textContent = Math.floor(diff / (1000 * 60 * 60)) % 24;
    document.getElementById("mins").textContent  = Math.floor(diff / (1000 * 60)) % 60;
    document.getElementById("secs").textContent  = Math.floor(diff / 1000) % 60;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);        // run again every second
}

// ===== 3. EVENT FILTER BUTTONS (Events page) =====
const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const chosen = button.dataset.filter;    // "all", "academic", ...
    document.querySelectorAll(".event").forEach(function (event) {
      if (chosen === "all" || event.dataset.category === chosen) {
        event.style.display = "";            // show
      } else {
        event.style.display = "none";        // hide
      }
    });
  });
});

// ===== 4. EVENT MODAL (Events page) =====
// When the modal opens, copy the clicked button's data-* values into it.
const modal = document.getElementById("eventModal");
if (modal) {
  modal.addEventListener("show.bs.modal", function (e) {
    const button = e.relatedTarget;          // the button that was clicked
    document.getElementById("mTitle").textContent = button.dataset.title;
    document.getElementById("mDate").textContent  = "Date: " + button.dataset.date;
    document.getElementById("mVenue").textContent = "Venue: " + button.dataset.venue;
    document.getElementById("mInfo").textContent  = button.dataset.info;
  });
}

// ===== 5. CONTACT FORM VALIDATION (Contact page) =====
const form = document.getElementById("form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();                      // stop the page from reloading
    let ok = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const date = document.getElementById("eventDate");
    const message = document.getElementById("message");
    const errors = document.querySelectorAll(".error");
    errors.forEach(function (x) { x.textContent = ""; });   // clear old errors

    if (name.value.trim() === "") { errors[0].textContent = "Please enter your name."; ok = false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;       // something@something.something
    if (!emailPattern.test(email.value.trim())) { errors[1].textContent = "Please enter a valid email."; ok = false; }

    if (date.value === "" || new Date(date.value) <= new Date()) { errors[2].textContent = "Please pick a future date."; ok = false; }

    if (message.value.trim() === "") { errors[3].textContent = "Please write a message."; ok = false; }

    if (ok) {
      document.getElementById("success").classList.remove("d-none");   // show success message
      form.reset();
    }
  });
}