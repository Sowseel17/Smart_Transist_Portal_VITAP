const storageKeys = {
  auth: "smartTransitAuth",
  booking: "smartTransitBooking"
};

const bookingSummary = document.getElementById("booking-summary");
const paymentOptions = document.getElementById("payment-options");
const paymentMessage = document.getElementById("payment-message");
const confirmPaymentButton = document.getElementById("confirm-payment");
const backDashboardButton = document.getElementById("back-dashboard");
const rideStatus = document.getElementById("ride-status");
const statusList = document.getElementById("status-list");

const options = [
  {
    id: "upi",
    title: "UPI Payment",
    note: "Pay instantly using PhonePe, GPay, Paytm, or BHIM UPI"
  },
  {
    id: "card",
    title: "Card Payment",
    note: "Use credit or debit card for secure payment"
  },
  {
    id: "wallet",
    title: "Wallet",
    note: "Pay using ride wallet and promo credits"
  },
  {
    id: "cash",
    title: "Cash",
    note: "Pay cash directly to your driver after trip"
  }
];

let selectedPayment = "";

const statusSteps = [
  "Booking placed",
  "Searching for nearby captain",
  "Captain found and notified",
  "Ride accepted by the captain"
];

function readJson(key) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ensureAuthAndBooking() {
  const auth = readJson(storageKeys.auth);
  const booking = readJson(storageKeys.booking);

  if (!auth?.signedIn) {
    window.location.href = "index.html";
    return null;
  }

  if (!booking) {
    window.location.href = "dashboard.html";
    return null;
  }

  return booking;
}

function renderSummary(booking) {
  bookingSummary.innerHTML = `
    <h4>Your Selected Ride</h4>
    <p><strong>From:</strong> ${booking.source}</p>
    <p><strong>To:</strong> ${booking.destination}</p>
    <p><strong>Mode:</strong> ${booking.mode.toUpperCase()}</p>
    <p><strong>Distance:</strong> ${booking.distance}</p>
    <p><strong>Time:</strong> ${booking.duration}</p>
    <p><strong>Fare:</strong> ${booking.fare}</p>
  `;
}

function renderPaymentOptions() {
  paymentOptions.innerHTML = options.map(option => `
    <button type="button" class="payment-card" data-payment="${option.id}">
      <h4>${option.title}</h4>
      <p>${option.note}</p>
    </button>
  `).join("");
}

function updatePaymentSelection() {
  const cards = paymentOptions.querySelectorAll(".payment-card");
  cards.forEach(card => {
    const active = card.dataset.payment === selectedPayment;
    card.classList.toggle("active-payment", active);
  });
}

function renderStatusStep(stepText, done = false) {
  const item = document.createElement("li");
  item.className = done ? "status-item done" : "status-item";
  item.textContent = stepText;
  statusList.appendChild(item);
}

function runRideStatusFlow() {
  rideStatus.classList.remove("hidden");
  statusList.innerHTML = "";

  statusSteps.forEach((step, index) => {
    setTimeout(() => {
      renderStatusStep(step, true);

      if (index === statusSteps.length - 1) {
        paymentMessage.textContent = "Ride accepted by the captain. Driver details will be shared shortly.";
      }
    }, 1100 * (index + 1));
  });
}

paymentOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-payment]");
  if (!button) {
    return;
  }

  selectedPayment = button.dataset.payment;
  paymentMessage.textContent = `Selected payment method: ${selectedPayment.toUpperCase()}`;
  updatePaymentSelection();
});

confirmPaymentButton.addEventListener("click", () => {
  if (!selectedPayment) {
    paymentMessage.textContent = "Please select one payment type to confirm booking.";
    return;
  }

  confirmPaymentButton.disabled = true;
  confirmPaymentButton.textContent = "Processing...";
  paymentMessage.textContent = `Payment confirmed via ${selectedPayment.toUpperCase()}. Starting ride matching...`;
  runRideStatusFlow();
});

backDashboardButton.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

const booking = ensureAuthAndBooking();
if (booking) {
  renderSummary(booking);
  renderPaymentOptions();
}
