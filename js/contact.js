

//event filter buttons
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

// events page and modal
const modal = document.getElementById("eventModal");
if (modal) {
  modal.addEventListener("show.bs.modal", function (e) {
    const button = e.relatedTarget;          // the button that was clicked will become the target
    document.getElementById("mTitle").textContent = button.dataset.title;
    document.getElementById("mDate").textContent  = "Date: " + button.dataset.date;
    document.getElementById("mVenue").textContent = "Venue: " + button.dataset.venue;
    document.getElementById("mInfo").textContent  = button.dataset.info;
  });
}