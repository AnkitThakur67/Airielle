  function createFlightCard(flight) {
  return `
<div class="flight-card small">
  <div class="flight-card__image small">
      <img
        src="${convertDriveLink(flight.image) || 'assets/card_image.png'}"
        alt="Destination"
        loading="lazy"
      />
      <div class="badge-wrapper">
          <span class="badge ${flight.badgetype}">${flight.badge}</span>
      </div>
  </div>

  <div class="flight-card__body">
      <h3 class="flight-title">
          <span class="travel_from">${flight.from}</span>
          <span class="flight-icon"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <path d="M2.33334 13.1667L9.16668 11.6667L12.0833 14.5834C13.3333 15.8334 15 16.25 15.8333 15.8334C16.25 15 15.8333 13.3334 14.5833 12.0834L11.6667 9.16671L13.1667 2.33337C13.25 1.91671 13.0833 1.58337 12.75 1.41671L12.3333 1.16671C11.9167 1.00004 11.5 1.08337 11.25 1.41671L8.33334 5.83337L5.83334 4.16671V1.66671L5.00001 0.833374L3.33334 3.33337L0.833344 5.00004L1.66668 5.83337H4.16668L5.83334 8.33337L1.41668 11.25C1.08334 11.5 1.00001 11.9167 1.16668 12.3334L1.33334 12.75C1.58334 13.0834 1.91668 13.25 2.33334 13.1667Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg></span>
          <span class="travel_to">${flight.to}</span>
      </h3>

      <div class="flight-details-wrapper">

          <div class="flight-details">
              <div class="field_details">
                  <span class="field-sub-heading">Date & Time</span>
                  <span class="field-date main-color field--heading">
                    ${formatDate(flight.date)}
                  </span>
                  <span class="field-time flight-time"> ${formatTime(flight.time)}</span>
              </div>
          </div>

          <div class="flight-details">
              <div class="field_details">
                  <span class="field-sub-heading flight_type">Aircraft</span>
                  <span class="field-flight-name main-color field--heading">
                    ${flight.aircraft}
                  </span>
              </div>
          </div>

          <div class="flight-details">
              <div class="field_details">
                  <span class="field-sub-heading">Luggage</span>
                  <span class="field-luggage-max main-color field--heading">
                    ${flight.luggage}
                  </span>
              </div>
          </div>

          <div class="flight-details">
              <div class="field_details">
                  <span class="field-sub-heading">Available</span>
                  <span class="field-availabe-seats main-color field--heading">
                    ${flight.seats} seats
                  </span>
              </div>
          </div>

      </div>

      <div class="flight-note-wrapper">
          <h4 class="flight-note">Notes</h4>
          <p class="flight-note_text">${flight.notes}</p>
      </div>

      <div class="card-btn-wrapper">
          <div class="card-btn-content">
                <div class="price-wrapper">
                    <span class="price_heading">Price per seat</span>
                    <span class="price">€${Number(flight.price).toLocaleString()}</span>
                </div>

                <a href="/" class="btn-wrapper">
                    <span class="btn-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" version="1.1" id="Capa_1" viewBox="0 0 30.667 30.667" xml:space="preserve" style="width: 14px; height:14px;">
                            <path d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017 c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382 c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076 c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427 c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437 c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536 c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609 c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611 c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787 c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739 C23.307,19.268,23.307,18.533,23.214,18.38z"/>
                        </svg>
                    </span>
                    <span class="btn_text">Instant Inquiry</span>
                </a>
          </div>
      </div>

  </div>
</div>
`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}


function formatTime(timeStr) {
  if (!timeStr) return "";

  const d = new Date(timeStr);

  if (isNaN(d)) return timeStr;

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function convertDriveLink(url) {
  if (!url) return "assets/card_image.png";

  // If already a thumbnail link
  if (url.includes("thumbnail")) return url;

  // If already uc?export link
  if (url.includes("uc?export")) return url;

  // If full /file/d/ link
  const match = url.match(/\/d\/([^\/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }

  // If only FILE_ID is stored in sheet
  if (url.length > 20 && !url.includes("http")) {
    return `https://drive.google.com/thumbnail?id=${url}&sz=w1000`;
  }

  return url;
}

document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "https://script.google.com/macros/s/AKfycbx_SKB4s1OzBJs-3nUU1P_p2ou7JBsX3HMxMyXe9CI_CTjEOT4bCOwmzfmso3qT3es9/exec";
  const container = document.querySelector("#allFlightCards");

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";
      data.forEach(flight => {
        container.innerHTML += createFlightCard(flight);
        console.log(flight.time)
      });

    })
    .catch(err => {
      console.error("API Error:", err);
    });

});