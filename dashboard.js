const places = [
  "VIT-AP University",
  "Vijayawada Bus Stand",
  "Vijayawada Railway Station",
  "Vijayawada Airport",
  "Mangalagiri"
];

const distanceMap = {
  "VIT-AP University": {
    "Vijayawada Bus Stand": 20,
    "Vijayawada Railway Station": 25,
    "Vijayawada Airport": 45,
    "Mangalagiri": 14
  },
  "Vijayawada Bus Stand": {
    "Vijayawada Railway Station": 5,
    "Vijayawada Airport": 19,
    "Mangalagiri": 13
  },
  "Vijayawada Railway Station": {
    "Vijayawada Airport": 21,
    "Mangalagiri": 12
  },
  "Vijayawada Airport": {
    "Mangalagiri": 32
  }
};

const modeConfig = {
  bike: { vehicle: "Bike", speed: 38, baseFare: 55, perKm: 6.2 },
  auto: { vehicle: "Auto", speed: 28, baseFare: 75, perKm: 8.8 },
  car: { vehicle: "Car", speed: 35, baseFare: 110, perKm: 10.5 }
};

function getDistanceKm(source, destination) {
  if (distanceMap[source]?.[destination]) {
    return distanceMap[source][destination];
  }
  if (distanceMap[destination]?.[source]) {
    return distanceMap[destination][source];
  }
  return null;
}

function formatFare(distanceKm, config) {
  const estimated = Math.round(config.baseFare + distanceKm * config.perKm);
  const minFare = Math.round(estimated * 0.9);
  const maxFare = Math.round(estimated * 1.1);
  return `INR ${minFare}-${maxFare}`;
}

function formatDuration(distanceKm, config) {
  const baseMinutes = (distanceKm / config.speed) * 60;
  const minMinutes = Math.max(8, Math.round(baseMinutes * 0.9));
  const maxMinutes = Math.max(minMinutes + 2, Math.round(baseMinutes * 1.2));
  return `${minMinutes}-${maxMinutes} min`;
}

function buildAllRoutes() {
  const generated = [];

  places.forEach(source => {
    places.forEach(destination => {
      if (source === destination) {
        return;
      }

      const distanceKm = getDistanceKm(source, destination);
      if (!distanceKm) {
        return;
      }

      Object.entries(modeConfig).forEach(([mode, config]) => {
        generated.push({
          source,
          destination,
          mode,
          vehicle: config.vehicle,
          distance: `${distanceKm} km`,
          duration: formatDuration(distanceKm, config),
          fare: formatFare(distanceKm, config)
        });
      });
    });
  });

  return generated;
}

const routes = buildAllRoutes();

const storageKeys = {
  auth: "smartTransitAuth",
  user: "smartTransitUser",
  planner: "smartTransitPlanner",
  booking: "smartTransitBooking"
};

const sourceSelect = document.getElementById("source-select");
const destinationSelect = document.getElementById("destination-select");
const showModesButton = document.getElementById("show-modes");
const swapRouteButton = document.getElementById("swap-route");
const resetPlannerButton = document.getElementById("reset-planner");
const sortSelect = document.getElementById("sort-select");
const plannerMessage = document.getElementById("planner-message");
const modeList = document.getElementById("mode-list");
const logoutButton = document.getElementById("logout-btn");
const sessionBadge = document.getElementById("session-badge");

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

function savePlannerState(state) {
  localStorage.setItem(storageKeys.planner, JSON.stringify(state));
}

function parseFare(fare) {
  const values = fare.replace("INR", "").trim().split("-").map(part => Number(part.trim()));
  if (values.length === 1) {
    return values[0];
  }
  return Math.min(...values);
}

function parseDuration(duration) {
  const values = duration.replace("min", "").trim().split("-").map(part => Number(part.trim()));
  if (values.length === 1) {
    return values[0];
  }
  return Math.min(...values);
}

function getSortedModes(modes, sortValue) {
  const copy = [...modes];

  if (sortValue === "lowest-fare") {
    copy.sort((a, b) => parseFare(a.fare) - parseFare(b.fare));
  }

  if (sortValue === "fastest-time") {
    copy.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
  }

  return copy;
}

function createModeCard(route) {
  return `
    <article class="route-card">
      <h4>${route.mode}</h4>
      <p class="route-meta"><strong>Vehicle:</strong> ${route.vehicle}</p>
      <p class="route-meta"><strong>From:</strong> ${route.source}</p>
      <p class="route-meta"><strong>To:</strong> ${route.destination}</p>
      <p class="route-meta"><strong>Distance:</strong> ${route.distance}</p>
      <p class="route-meta"><strong>Time:</strong> ${route.duration}</p>
      <p class="route-meta"><strong>Fare:</strong> ${route.fare}</p>
      <button class="choose-btn" type="button" data-choose-mode="${route.mode}" data-choose-destination="${route.destination}" data-choose-source="${route.source}">
        Choose This Mode
      </button>
    </article>
  `;
}

function getRouteOptions(source, destination) {
  return routes.filter(route => route.source === source && route.destination === destination);
}

function renderModes(source, destination) {
  const availableModes = getRouteOptions(source, destination);
  const sortedModes = getSortedModes(availableModes, sortSelect.value);

  plannerMessage.textContent = `Found ${sortedModes.length} mode(s) from ${source} to ${destination}.`;
  modeList.innerHTML = sortedModes.length
    ? sortedModes.map(route => createModeCard(route)).join("")
    : "<p>No transport modes available for this destination.</p>";
}

function restoreSessionHeader() {
  const auth = readJson(storageKeys.auth);
  if (!auth?.signedIn) {
    window.location.href = "index.html";
    return;
  }

  const user = readJson(storageKeys.user);
  const name = user?.name ? user.name : auth.email;
  sessionBadge.textContent = `Signed in as ${name}`;
}

showModesButton.addEventListener("click", () => {
  const source = sourceSelect.value;
  const destination = destinationSelect.value;

  if (!source || !destination) {
    plannerMessage.textContent = "Please select both present place and destination.";
    modeList.innerHTML = "";
    return;
  }

  if (source === destination) {
    plannerMessage.textContent = "Source and destination should be different.";
    modeList.innerHTML = "";
    return;
  }

  renderModes(source, destination);
  savePlannerState({ source, destination, selectedMode: "", sort: sortSelect.value });
});

sortSelect.addEventListener("change", () => {
  const source = sourceSelect.value;
  const destination = destinationSelect.value;

  if (!source || !destination || source === destination) {
    return;
  }

  renderModes(source, destination);
  const saved = readJson(storageKeys.planner) || {};
  savePlannerState({ ...saved, source, destination, sort: sortSelect.value });
});

modeList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-choose-mode]");
  if (!button) {
    return;
  }

  const source = sourceSelect.value;
  const routeSource = button.dataset.chooseSource;
  const destination = button.dataset.chooseDestination;
  const mode = button.dataset.chooseMode;

  const selectedRoute = routes.find(route => route.source === routeSource && route.destination === destination && route.mode === mode);
  if (!selectedRoute) {
    return;
  }

  const saved = readJson(storageKeys.planner) || {};
  savePlannerState({ ...saved, source, destination, selectedMode: mode, sort: sortSelect.value });

  localStorage.setItem(storageKeys.booking, JSON.stringify({
    source: selectedRoute.source,
    destination,
    mode: selectedRoute.mode,
    distance: selectedRoute.distance,
    duration: selectedRoute.duration,
    fare: selectedRoute.fare
  }));

  window.location.href = "payment.html";
});

swapRouteButton.addEventListener("click", () => {
  const currentSource = sourceSelect.value;
  const currentDestination = destinationSelect.value;

  sourceSelect.value = currentDestination;
  destinationSelect.value = currentSource;
  plannerMessage.textContent = "Source and destination swapped.";

  modeList.innerHTML = "";

  const saved = readJson(storageKeys.planner) || {};
  savePlannerState({ ...saved, source: sourceSelect.value, destination: destinationSelect.value, selectedMode: "", sort: sortSelect.value });
});

resetPlannerButton.addEventListener("click", () => {
  sourceSelect.value = "";
  destinationSelect.value = "";
  sortSelect.value = "recommended";
  plannerMessage.textContent = "Planner reset. Choose source and destination to continue.";
  modeList.innerHTML = "";
  localStorage.removeItem(storageKeys.planner);
  localStorage.removeItem(storageKeys.booking);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(storageKeys.auth);
  window.location.href = "index.html";
});

function restorePlannerState() {
  const saved = readJson(storageKeys.planner);
  if (!saved) {
    return;
  }

  sourceSelect.value = saved.source || "";
  destinationSelect.value = saved.destination || "";
  sortSelect.value = saved.sort || "recommended";

  if (saved.source && saved.destination && saved.source !== saved.destination) {
    renderModes(saved.source, saved.destination);
    plannerMessage.textContent = "Restored your last planner state.";

    if (saved.selectedMode) {
      const selectedRoute = routes.find(route => route.source === saved.source && route.destination === saved.destination && route.mode === saved.selectedMode);
      if (selectedRoute) {
        localStorage.setItem(storageKeys.booking, JSON.stringify({
          source: saved.source,
          destination: saved.destination,
          mode: selectedRoute.mode,
          distance: selectedRoute.distance,
          duration: selectedRoute.duration,
          fare: selectedRoute.fare
        }));
      }
    }
  }
}

restoreSessionHeader();
restorePlannerState();
