const API_URL = "https://script.google.com/macros/s/AKfycbzNwadfxYG-Vu2gjNzsXF7wdfaZan94_s9Gf8vUV8Is2929X9VVK2yN_rhfrh5xhz5p/exec";

const form = document.getElementById("adminLoginForm");
const idInput = document.getElementById("adminId");
const passInput = document.getElementById("adminPassword");
const rememberCheckbox = document.getElementById("rememberMe");
const messageBox = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  clearErrors();

  let isValid = true;

  if (!idInput.value.trim()) {
    showFieldError(idInput, "Admin ID is required");
    isValid = false;
  }

  if (!passInput.value.trim()) {
    showFieldError(passInput, "Password is required");
    isValid = false;
  }

  if (!isValid) return;

  setLoading(true);
  showMessage("Authenticating...", "loading");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        id: idInput.value.trim(),
        password: passInput.value.trim()
      })
    });

    const data = await response.json();

    if (data.status === "success") {

      if (rememberCheckbox.checked) {
        localStorage.setItem("adminToken", data.token);
      } else {
        sessionStorage.setItem("adminToken", data.token);
      }

      showMessage("Login successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } else {
      showMessage("Invalid Admin ID or Password", "error");
    }

  } catch (err) {
    console.error(err);
    showMessage("Server unreachable. Please try again.", "error");
  }

  setLoading(false);
});


/* ===== FIELD ERROR ===== */
function showFieldError(input, message) {
  const field = input.closest(".field");
  const fieldInput = field.querySelector(".field-input");
  const error = field.querySelector(".error-message");
  error.textContent = message;
  error.classList.remove("hidden");
  fieldInput.classList.add("input-error");
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => {
    el.classList.add("hidden");
  });

  document.querySelectorAll("input").forEach(input => {
    input.classList.remove("input-error");
  });
}


/* ===== GLOBAL MESSAGE ===== */
function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = "form-message " + type;
  messageBox.classList.remove("hidden");
}


/* ===== LOADING STATE ===== */
function setLoading(isLoading) {
  const btn = form.querySelector("button");
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Please wait..." : "Login to Dashboard";
}