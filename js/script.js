document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  // =========================
  const form = document.getElementById("searchForm");

  const nooftravels = document.getElementById("nooftravels");
  const traveltype = document.getElementById("traveltype");
  const fromCity = document.getElementById("fromCity");
  const toCity = document.getElementById("toCity");
  const departDate = document.getElementById("departDate");

  const searchResultSection = document.getElementById("searchResultSection");
  const reverseIcon = document.querySelector(".reverse-icon");

  const resultBox = document.getElementById("filteredResults");
  const sectionTitle = document.querySelector(".search-result-title");

  const allFields = [nooftravels, traveltype, fromCity, toCity, departDate];

  // =========================
  // LIVE ERROR CLEAR ON CHANGE
  // =========================
  allFields.forEach(el => {
    if (!el) return;

    el.addEventListener("change", () => clearFieldError(el));
    el.addEventListener("input", () => clearFieldError(el));
  });

  function clearFieldError(inputEl) {
    const wrapper = inputEl.closest(".field-input");
    const field = inputEl.closest(".field");
    const msg = field?.querySelector(".error-message");

    if (wrapper) wrapper.classList.remove("field-input--invalid");
    if (msg) msg.textContent = "";
  }

  // =========================
  // SELECT OPEN CLASS
  // =========================
  document.querySelectorAll(".field-input select").forEach(select => {
    const wrap = select.closest(".field-input");

    select.addEventListener("pointerdown", () => {
      document.querySelectorAll(".field-input.open")
        .forEach(w => w.classList.remove("open"));
      wrap.classList.add("open");
    });

    select.addEventListener("change", () => wrap.classList.remove("open"));
    select.addEventListener("blur", () => wrap.classList.remove("open"));
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".field-input")) {
      document.querySelectorAll(".field-input.open")
        .forEach(w => w.classList.remove("open"));
    }
  });

  // =========================
  // DATE DEFAULT + MIN
  // =========================
  if (departDate) {
    const today = new Date().toISOString().split("T")[0];
    departDate.min = today;
    departDate.value = today;
  }

  // =========================
  // SWAP FROM/TO
  // =========================
  if (reverseIcon) {
    reverseIcon.addEventListener("click", () => {
      const tmp = fromCity.value;
      fromCity.value = toCity.value;
      toCity.value = tmp;
    });
  }

  // =========================
  // RESULTS HEIGHT CONTROL
  // =========================
  function openResults() {
    searchResultSection.classList.add("visible");
    searchResultSection.style.height =
      searchResultSection.scrollHeight + "px";

    searchResultSection.addEventListener("transitionend", function handler() {
      searchResultSection.style.height = "auto";
      searchResultSection.removeEventListener("transitionend", handler);
    });
  }

  function closeResults() {
    searchResultSection.style.height =
      searchResultSection.scrollHeight + "px";

    requestAnimationFrame(() => {
      searchResultSection.style.height = "0px";
    });

    searchResultSection.classList.remove("visible");
  }

  // =========================
  // FORM SUBMIT
  // =========================
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let hasError = false;

    if (!nooftravels.value) { setError(nooftravels, "Select travelers"); hasError = true; }
    if (!traveltype.value) { setError(traveltype, "Select type"); hasError = true; }
    if (!fromCity.value) { setError(fromCity, "Select origin"); hasError = true; }
    if (!toCity.value) { setError(toCity, "Select destination"); hasError = true; }

    if (fromCity.value && toCity.value && fromCity.value === toCity.value) {
      setError(toCity, "Origin & destination same");
      hasError = true;
    }

    if (!departDate.value) { setError(departDate, "Select date"); hasError = true; }

    if (hasError) {
      closeResults();
      return;
    }

    runFilter();
  });

  // =========================
  // FILTER ENGINE
  // =========================
  function runFilter() {
    console.log("Cards found:", document.querySelectorAll("#allFlightCards .flight-card").length);
    if (!resultBox) {
        console.error("filteredResults container missing");
      return;
    }

    const cards = document.querySelectorAll("#allFlightCards .flight-card");
    resultBox.innerHTML = "";

    // const range = getTravelerRange(nooftravels.value);
    const neededSeats = getMinTravelers(nooftravels.value);
    const fromText = fromCity.options[fromCity.selectedIndex].text.split(" ")[0];
    const toText = toCity.options[toCity.selectedIndex].text.split(" ")[0];

    let matches = 0;

    cards.forEach(card => {

      const cardFrom = card.querySelector(".travel_from")?.textContent.trim();
      const cardTo = card.querySelector(".travel_to")?.textContent.trim();
      const seatsText = card.querySelector(".badge")?.textContent;
      const cardDateText = card.querySelector(".field-date")?.textContent;
      const cardType = card.dataset.type;

      const seats = extractSeats(seatsText);
      // const cardISO = convertToISO(cardDateText);

      const match =
        seats >= neededSeats &&
        cardFrom === fromText &&
        cardTo === toText &&
        cardType === traveltype.value;
      console.log("COMPARE FROM:", cardFrom, fromText);
      console.log("COMPARE TO:", cardTo, toText);
      console.log("COMPARE TYPE:", cardType, traveltype.value);
      console.log("SEATS:", seats, neededSeats );
      if (match) {
        resultBox.appendChild(card.cloneNode(true));
        matches++;
      }
    });
    console.log(`matches Results are:- ${matches}`)

    sectionTitle.textContent =
      matches === 0 ? "No results found" : "Serach result";

    openResults();

    searchResultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // =========================
  // HELPERS
  // =========================
  function setError(inputEl, message) {
    const field = inputEl.closest(".field");
    const wrapper = inputEl.closest(".field-input");
    const msg = field.querySelector(".error-message");

    if (wrapper) wrapper.classList.add("field-input--invalid");
    if (msg) {
      msg.textContent = message;
      msg.classList.remove("hidden");
    }
  }

  function clearErrors() {
    document.querySelectorAll(".field-input--invalid")
      .forEach(el => el.classList.remove("field-input--invalid"));

    document.querySelectorAll(".error-message")
      .forEach(m => {
        m.textContent = "";
        m.classList.add("hidden");
      });
  }

  function extractSeats(text) {
    const m = text?.match(/\d+/);
    return m ? parseInt(m[0]) : 0;
  }

  function getMinTravelers(val) {
    if (!val) return 0;

    if (val.includes("-")) {
      return parseInt(val.split("-")[0]); // use MIN only
    }

    if (val.includes("+")) {
      return parseInt(val);
    }

    return parseInt(val);
  }



  function convertToISO(text) {
    const d = new Date(text);
    if (isNaN(d)) return null;
    return d.toISOString().split("T")[0];
  }

});
