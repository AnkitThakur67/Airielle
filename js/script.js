document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const form = document.getElementById("searchForm");
  const nooftravels = form.querySelector("#nooftravels");
  const traveltype = form.querySelector("#traveltype");
  const fromCity = form.querySelector("#fromCity");
  const toCity = form.querySelector("#toCity");
  const departDate = form.querySelector("#departDate")

  const searchResultSection = document.getElementById("searchResultSection");
  const resultBox = document.getElementById("filteredResults");
  const sectionTitle = document.querySelector(".search-result-title");

  const reverseIcon = document.querySelector(".reverse-icon");
  const dateDisplay = document.getElementById("dateDisplay");

  const allFields = [nooftravels, traveltype, fromCity, toCity, departDate];

  
  // LIVE ERROR CLEAR
  allFields.forEach(el => {
    if (!el) return;
    el.addEventListener("change", () => clearFieldError(el));
    el.addEventListener("input", () => clearFieldError(el));
  });

  function clearFieldError(inputEl) {
    const wrapper = inputEl.closest(".field-input");
    const field = inputEl.closest(".field");
    const msg = field?.querySelector(".error-message");

    wrapper?.classList.remove("field-input--invalid");
    if (msg) {
      msg.textContent = "";
      msg.classList.add("hidden");
    }
  }

  // DATE DEFAULT + MIN
  if (departDate) {
    const today = new Date().toISOString().split("T")[0];
    departDate.min = today;
    departDate.value = today;
  }

  // =========================
  // DATE RANGE DISPLAY
  // =========================
  function formatDateRange(isoDate) {
    if (!isoDate) return "";

    const start = new Date(isoDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 9);

    const opts = { weekday: "short", day: "numeric", month: "short" };

    return `${start.toLocaleDateString("en-GB", opts)} - ${end.toLocaleDateString("en-GB", opts)}`;
  }

  function updateDateDisplay() {
    if (!dateDisplay || !departDate.value) return;
    dateDisplay.textContent = formatDateRange(departDate.value);
  }

  departDate?.addEventListener("change", updateDateDisplay);
  updateDateDisplay();

  dateDisplay?.addEventListener("click", () => departDate.showPicker());

  // SWAP FROM / TO
  reverseIcon?.addEventListener("click", () => {
    const tmp = fromCity.value;
    fromCity.value = toCity.value;
    toCity.value = tmp;
  });

  // RESULTS OPEN/CLOSE
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

  // FORM SUBMIT
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let err = false;

    if (!nooftravels.value) { setError(nooftravels, "Select travelers"); err = true; }
    if (!traveltype.value) { setError(traveltype, "Select type"); err = true; }
    if (!fromCity.value) { setError(fromCity, "Select origin"); err = true; }
    if (!toCity.value) { setError(toCity, "Select destination"); err = true; }
    if (!departDate.value) { setError(departDate, "Select date"); err = true; }

    if (fromCity.value === toCity.value) {
      setError(toCity, "Origin & destination same");
      err = true;
    }

    if (err) {
      closeResults();
      return;
    }

    runFilter();
  });

  // FILTER ENGINE
  function runFilter() {

    const cards = document.querySelectorAll("#allFlightCards .flight-card");
    resultBox.innerHTML = "";
    const neededSeats = getMinTravelers(nooftravels.value);
    const fromText = fromCity.options[fromCity.selectedIndex].text.trim();
    const toText = toCity.options[toCity.selectedIndex].text.trim();
    let matches = 0;
    cards.forEach(card => {
      const cardFrom = card.querySelector(".travel_from")?.textContent.trim();
      const cardTo = card.querySelector(".travel_to")?.textContent.trim();
      const seatsText = card.querySelector(".badge")?.textContent;
      const cardType = card.dataset.type;

      const cardDateText = card.querySelector(".field-date")?.textContent;
      const cardISO = textDateToISO(cardDateText);
      const cardTimeText = card.querySelector(".flight-time")?.textContent?.trim();
      const seats = extractSeats(seatsText);

      console.log("CARD:", cardFrom, cardTo, seats, cardISO);

      const match =
        seats >= neededSeats &&
        cardFrom?.toLowerCase() === fromText.toLowerCase() &&
        cardTo?.toLowerCase() === toText.toLowerCase() &&
        cardType === traveltype.value &&
        isDateAllowed(cardISO, cardTimeText, departDate.value, 9);
      if (match) {
        resultBox.appendChild(card.cloneNode(true));
        matches++;
      }

    });

    sectionTitle.textContent =
      matches === 0 ? "No results found" : "Search result";

    openResults();

    searchResultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // HELPERS
  
  function setError(inputEl, message) {
    const field = inputEl.closest(".field");
    const wrapper = inputEl.closest(".field-input");
    const msg = field.querySelector(".error-message");

    wrapper?.classList.add("field-input--invalid");
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
    if (val.includes("-")) return parseInt(val.split("-")[0]);
    if (val.includes("+")) return parseInt(val);
    return parseInt(val);
  }

  function textDateToISO(text) {
    if (!text) return null;
    text = text.replace("Date & Time", "").trim();
    const d = new Date(text);
    if (isNaN(d)) return null;
    return d; // return DATE OBJECT (not string)
  }

  function isDateAllowed(cardDateObj, _cardTimeText, searchISO, rangeDays) {
    if (!cardDateObj || !searchISO) return false;
    const now = new Date();
    const start = new Date(searchISO);
    const end = new Date(searchISO);
    end.setDate(end.getDate() + rangeDays);
    // normalize date-only for window check
    const cardDay = new Date(cardDateObj);
    cardDay.setHours(0,0,0,0);
    const startDay = new Date(start);
    startDay.setHours(0,0,0,0);
    const endDay = new Date(end);
    endDay.setHours(0,0,0,0);
    // ❌ outside window
    if (cardDay < startDay || cardDay > endDay) {
      console.log("OUTSIDE RANGE:", cardDateObj);
      return false;
    }
    // check if search date is today
    const today = new Date();
    today.setHours(0,0,0,0);
    if (startDay.getTime() === today.getTime()) {
      // 🔴 TODAY → check time
      console.log("TODAY CHECK:", cardDateObj, ">=", now);
      return cardDateObj >= now;
    }
    // ✅ future date → allow (date match already done)
    console.log("FUTURE DATE ALLOW:", cardDateObj);
    return true;
  }

});
