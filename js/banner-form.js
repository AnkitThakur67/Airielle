document.addEventListener("DOMContentLoaded", () => {
  const SOURCE_CARDS = [ ...document.querySelectorAll("#allFlightCards .flight-card") ];

  const form = document.getElementById("flightForm");

  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const depart = document.getElementById("depart");
  const returnDate = document.getElementById("return");
  const travelers = document.getElementById("travelers");
  const type = document.getElementById("type");
  const phone = document.getElementById("phone");

  const departShow = document.querySelector(".depart-date");
  const returnShow = document.querySelector(".return-date");

  const searchResultSection = document.getElementById("searchResultSection");
  const resultBox = document.getElementById("filteredResults");
  const sectionTitle = document.querySelector(".search-result-title");

  const returnField = returnDate.closest(".field");

  const allFields = [from, to, depart, returnDate, travelers, type, phone];

  /* =========================
     DATE SETUP
  ========================== */

  const today = new Date().toISOString().split("T")[0];
  depart.min = today;
  returnDate.min = today;

  /* =========================
     TYPE NORMALIZER
  ========================== */

  function normalizeType(v) {
    if (!v) return "";
    v = v.toLowerCase().trim();

    if (v.includes("one")) return "oneway";
    if (v.includes("two") || v.includes("round")) return "round";
    if (v.includes("jet")) return "oneway";

    return v;
  }

  /* =========================
     ONE WAY / ROUND TRIP TOGGLE
  ========================== */

  type.addEventListener("change", () => {

    const oneWay = normalizeType(type.value) === "oneway";

    returnField.style.display = oneWay ? "none" : "";
    returnField.classList.toggle("hidden", oneWay);

    if (oneWay) {
      returnDate.value = "";
      if (returnShow) returnShow.textContent = "Select Date";
      clearFieldError(returnDate);
    }
  });

  /* =========================
     DATE DISPLAY FORMAT
  ========================== */

  function formatPretty(value) {
    if (!value) return "Select Date";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  depart.addEventListener("change", () => {
    if (departShow) departShow.textContent = formatPretty(depart.value);
  });

  returnDate.addEventListener("change", () => {
    if (returnShow) returnShow.textContent = formatPretty(returnDate.value);
  });

  /* =========================
     ERROR HELPERS
  ========================== */

  allFields.forEach(el => {
    el.addEventListener("input", () => clearFieldError(el));
    el.addEventListener("change", () => clearFieldError(el));
  });

  function clearFieldError(input) {
    const field = input.closest(".field");
    if (!field) return;

    field.querySelector(".field-input")
      ?.classList.remove("field-input--invalid");

    field.querySelector(".error-message")
      ?.classList.add("hidden");
  }

  function setError(input, message) {
    const field = input.closest(".field");
    if (!field) return;

    field.querySelector(".field-input")
      ?.classList.add("field-input--invalid");

    const msg = field.querySelector(".error-message");
    if (msg) {
      msg.textContent = message;
      msg.classList.remove("hidden");
    }
  }

  /* =========================
     RESULT OPEN
  ========================== */

  function openResults() {

    searchResultSection.classList.add("visible");

    // let browser render new cards first
    requestAnimationFrame(() => {
      searchResultSection.style.height =
        searchResultSection.scrollHeight + "px";

      // release height after animation
      setTimeout(() => {
        searchResultSection.style.height = "auto";
      }, 350); // match your CSS transition time
    });

    searchResultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  /* =========================
     CARD DATA EXTRACTOR
  ========================== */

  function extractSeats(text) {
    if (!text) return 0;
    const m = text.match(/\d+/);
    return m ? Number(m[0]) : 0;
  }

  function textDateToISO(text) {
    if (!text) return null;
    const clean = text.replace(/\s+/g, " ").trim();
    const d = new Date(clean);
    return isNaN(d.getTime()) ? null : d;
  }

  function getCardData(card) {
    return {
      fromText: card.querySelector(".travel_from")
        ?.textContent.trim().toLowerCase(),

      toText: card.querySelector(".travel_to")
        ?.textContent.trim().toLowerCase(),

      typeValue: card.dataset.type || "",

      seats: extractSeats(
        card.querySelector(".badge")?.textContent
      ),

      cardDateISO: textDateToISO(
        card.querySelector(".field-date")?.textContent
      )
    };
  }

  function isDateMatch(cardDate, searchISO) {
    if (!cardDate || !searchISO) return false;

    const s = new Date(searchISO);

    return (
      cardDate.getFullYear() === s.getFullYear() &&
      cardDate.getMonth() === s.getMonth() &&
      cardDate.getDate() === s.getDate()
    );
  }

  /* =========================
     FILTER ENGINE
  ========================== */

  function runFilter() {

    const cards = SOURCE_CARDS;
    const departBox = document.querySelector(".departure_flights");
    const returnBox = document.querySelector(".return_flights");

    departBox.innerHTML = "";
    returnBox.innerHTML = "";

    const searchFrom = from.value.trim().toLowerCase();
    const searchTo = to.value.trim().toLowerCase();
    const neededSeats = Number(travelers.value);

    const departDate = depart.value;
    const retDate = returnDate.value;

    const tripType = normalizeType(type.value);

    let departMatches = 0;
    let returnMatches = 0;

    cards.forEach(card => {

      const data = getCardData(card);

      /* ========= OUTBOUND ========= */

      const outboundMatch =
        data.fromText === searchFrom &&
        data.toText === searchTo &&
        data.seats >= neededSeats &&
        isDateMatch(data.cardDateISO, departDate);

      if (outboundMatch) {
        departBox.appendChild(card.cloneNode(true));
        departMatches++;
      }

      /* ========= RETURN ========= */

      if (tripType === "round") {

        const returnMatch =
          data.fromText === searchTo &&
          data.toText === searchFrom &&
          data.seats >= neededSeats &&
          isDateMatch(data.cardDateISO, retDate);

        if (returnMatch) {
          returnBox.appendChild(card.cloneNode(true));
          returnMatches++;
        }
      }

    });

    /* ========= SHOW / HIDE RETURN SECTION ========= */

    returnBox.classList.toggle("hidden", tripType !== "round");

    const total = departMatches + returnMatches;

    sectionTitle.textContent =
      total === 0
        ? "No Results Found"
        : `Search Result (${total})`;

    openResults();
    // console.log(`data.fromText is ${data.fromText} and the form searchFrom is ${searchFrom}`);
    // console.log(`data.toText is ${data.toText} and the form searchTo is ${searchTo}`);
    // console.log(`data.typeValue is ${data.typeValue} and the form searchType is ${searchType}`);
    // console.log(`data.seats is ${data.seats} and the form neededSeats is ${neededSeats}`);
    // console.log(`data.seats is ${data.seats} and the form neededSeats is ${neededSeats}`);
    // console.log(`data is matched by ${isDateMatch(data.cardDateISO, retDate)}`);
  }



  /* =========================
     FORM VALIDATION
  ========================== */

  form.addEventListener("submit", (e) => {

    e.preventDefault();
    let error = false;
    allFields.forEach(clearFieldError);

    if (!from.value.trim()) {
      setError(from, "Origin required");
      error = true;
    }

    if (!to.value.trim()) {
      setError(to, "Destination required");
      error = true;
    }

    if (from.value === to.value && from.value) {
      setError(to, "Origin & destination cannot match");
      error = true;
    }

    if (!depart.value) {
      setError(depart, "Departure required");
      error = true;
    }

    if (normalizeType(type.value) !== "oneway") {

      if (!returnDate.value) {
        setError(returnDate, "Return required");
        error = true;
      }

      if (returnDate.value && returnDate.value < depart.value) {
        setError(returnDate, "Return after departure");
        error = true;
      }
    }

    if (!travelers.value) {
      setError(travelers, "Select travelers");
      error = true;
    }

    if (!type.value) {
      setError(type, "Select type");
      error = true;
    }

    if (!phone.value.trim()) {
      setError(phone, "Phone required");
      error = true;
    }

    if (error) return;

    runFilter();
  });


  document.querySelectorAll(".btn-wrapper").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();

      const card = btn.closest(".flight-card");

      const from = card.querySelector(".travel_from").innerText;
      const to = card.querySelector(".travel_to").innerText;
      const date = card.querySelector(".field-date").innerText;
      const time = card.querySelector(".flight-time").innerText;
      const price = card.querySelector(".price").innerText;

      const message =
        `Instant Inquiry 🚀
        Flight: ${from} → ${to}
        Date: ${date}
        Time: ${time}
        Price: ${price}`;

      const phone = "9736456873"; // ← your number
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
    });
  });
});
