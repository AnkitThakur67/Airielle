document.addEventListener("DOMContentLoaded", () => {

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  // Fix height on page load if active
  if (item.classList.contains("active")) {
    answer.style.height = answer.scrollHeight + "px";
  }

  question.addEventListener("click", () => {

    faqItems.forEach(faq => {
      const ans = faq.querySelector(".faq-answer");

      if (faq !== item) {
        faq.classList.remove("active");
        ans.style.height = 0;
      }
    });

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      answer.style.height = 0;
    } else {
      item.classList.add("active");
      answer.style.height = answer.scrollHeight + "px";
    }

  });
});

  const form = document.getElementById("flightForm");

  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const depart = document.getElementById("depart");
  const returnDate = document.getElementById("return");
  const travelers = document.getElementById("travelers");
  const type = document.getElementById("type");
  const phone = document.getElementById("phone");
  const terms = document.getElementById("terms");

  const departShow = document.querySelector(".depart-date");
  const returnShow = document.querySelector(".return-date");

  const returnField = returnDate.closest(".field");

  const allFields = [from, to, depart, returnDate, travelers, type, phone, terms];

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
     FORM SUBMIT
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

    const phoneVal = phone.value.trim();
    const allowedPattern = /^\+?[0-9\s\-]+$/;

    if (!phoneVal) {
      setError(phone, "Phone required");
      error = true;

    } else if (!allowedPattern.test(phoneVal)) {
      setError(phone, "Only numbers allowed");
      error = true;

    } else {
      const digitsOnly = phoneVal.replace(/\D/g, '');

      if (digitsOnly.length < 10) {
        setError(phone, "Enter valid phone number");
        error = true;
      }
    }

    if (!terms.checked) {
      setError(terms, "You must accept Terms & Conditions");
      error = true;
    }

    if (error) return;

    /* =========================
       SEND TO WHATSAPP
    ========================== */

    const message =
`New Flight Inquiry ✈️

From: ${from.value}
To: ${to.value}
Departure: ${formatPretty(depart.value)}
Return: ${normalizeType(type.value) === "round" ? formatPretty(returnDate.value) : "One Way"}
Travelers: ${travelers.value}
Trip Type: ${type.value}
Customer Phone: ${phone.value}`;

    const whatsappNumber = "9988074677"; // Change to your number

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

  });

});