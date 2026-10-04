const locations = [
    {
        image: "images/IMG-20260927-WA0236.jpg",
        name: "Cementerio Recoleta",
        lat: -34.58731618154304,
        lng: -58.39293113189348
    },
    {
        image: "images/20260929_124334.jpg",
        name: "Shell Flores",
        lat: -34.623863936898566, 
        lng: -58.46469165908699
    },
    {
        image: "images/20260822_161703.jpg",
        name: "Museo bellas artes",
        lat: -34.58393698840659, 
        lng: -58.39301301496469
    },
    {
        image: "images/20260801_104755.jpg",
        name: "Clavo de tren de la costa",
        lat: -34.48626608232966, 
        lng: -58.480503361791854
    },
        {
        image: "images/ituzaingo-torre-eiffel-sera-sede-de-una-feria-de-emprendedores.jpg",
        name: "Torre Eiffel Ituzaingó",
        lat: -34.64269001132382,  
        lng: -58.65734156056136
    },
        {
        image: "images/IMG-20260911-WA0118.jpg",
        name: "tu segunda casa",
        lat: -34.65661499500905,  
        lng: -58.635674845218716
    },
        {
        image: "images/image.png",
        name: "Plaza colón Lujan",
        lat: -34.566066835933796,  
        lng: -59.11512535369201
    },
        {
        image: "images/20260914_211858.jpg",
        name: "Estación Castelar",
        lat: -34.651535302844074,  
        lng: -58.64057956838814
    },
        {
        image: "images/Captura de pantalla 2026-10-04 171424.png",
        name: "Callecita barrio Rawson",
        lat: -34.596285514724514, 
        lng: -58.48567351634198
    },
        {
        image: "images/IMG-20260919-WA0100 (1).jpg",
        name: "No hace falta ni decirlo ;)",
        lat: -34.595564356689664,  
        lng: -58.37429670368958
    }
];

let currentRound = 0;
let score = 0;
let selectedLatLng = null;
let selectedMarker = null;
let correctMarker = null;
let resultLine = null;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-button");
const confirmButton = document.getElementById("confirm-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const roundText = document.getElementById("round-text");
const scoreText = document.getElementById("score-text");
const progressBar = document.getElementById("progress-bar");
const locationImage = document.getElementById("location-image");

const roundResult = document.getElementById("round-result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");

const finalScore = document.getElementById("final-score");
const finalTitle = document.getElementById("final-title");
const finalMessage = document.getElementById("final-message");

let map = L.map("map", {
    zoomControl: true
}).setView([-34.61, -58.50], 10);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

function showScreen(screen) {
    startScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    screen.classList.add("active");

    if (screen === gameScreen) {
        setTimeout(() => map.invalidateSize(), 50);
    }
}

function loadRound() {
    const location = locations[currentRound];

    selectedLatLng = null;

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
        selectedMarker = null;
    }

    if (correctMarker) {
        map.removeLayer(correctMarker);
        correctMarker = null;
    }

    if (resultLine) {
        map.removeLayer(resultLine);
        resultLine = null;
    }

    locationImage.src = location.image;
    locationImage.alt = "Foto de " + location.name;

    roundText.textContent =
        `Ronda ${currentRound + 1} de ${locations.length}`;

    scoreText.textContent =
        `${score} puntos`;

    progressBar.style.width =
        `${((currentRound + 1) / locations.length) * 100}%`;

    confirmButton.disabled = true;
    roundResult.classList.add("hidden");

    map.setView([-34.61, -58.50], 10);
}

map.on("click", function (event) {
    if (!gameScreen.classList.contains("active")) {
        return;
    }

    if (!roundResult.classList.contains("hidden")) {
        return;
    }

    selectedLatLng = event.latlng;

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
    }

    selectedMarker = L.marker(selectedLatLng).addTo(map);

    confirmButton.disabled = false;
});

function distanceInKm(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return earthRadius * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
}

function calculatePoints(distance) {
    if (distance < 0.1) return 5500;
    if (distance < 0.2) return 5000;
    if (distance < 0.5) return 4500;
    if (distance < 1) return 4000;
    if (distance < 2) return 3500;
    if (distance < 3) return 3000;
    if (distance < 5) return 2000;
    if (distance < 10) return 1000;
    if (distance < 20) return 500;
    return 100;
}

confirmButton.addEventListener("click", function () {
    if (!selectedLatLng) {
        return;
    }

    const location = locations[currentRound];

    const distance = distanceInKm(
        selectedLatLng.lat,
        selectedLatLng.lng,
        location.lat,
        location.lng
    );

    const points = calculatePoints(distance);

    score += points;

    correctMarker = L.marker([
        location.lat,
        location.lng
    ]).addTo(map);

    resultLine = L.polyline(
        [
            selectedLatLng,
            [location.lat, location.lng]
        ],
        {
            weight: 3
        }
    ).addTo(map);

    resultTitle.textContent =
        `${points} puntos`;

    resultText.textContent =
        `La ubicación correcta era ${location.name}. Estuviste a ${distance.toFixed(1)} km.`;

    scoreText.textContent =
        `${score} puntos`;

    roundResult.classList.remove("hidden");

    confirmButton.disabled = true;
});

nextButton.addEventListener("click", function () {
    currentRound++;

    if (currentRound < locations.length) {
        loadRound();
    } else {
        showResults();
    }
});

function showResults() {
    showScreen(resultScreen);

    finalScore.textContent =
        score;

    if (score >= 45000) {
        finalTitle.textContent = "Impecable che";
        finalMessage.textContent =
            "Hasta yo estoy sorprendido amor, sos una genia";
    } else if (score >= 35000) {
        finalTitle.textContent = "Muy sólida amor, felicidades";
        finalMessage.textContent =
            "Pifiaste la del calvo no? jajaja";
    } else if (score >= 20000) {
        finalTitle.textContent = "Bastante bien eh";
        finalMessage.textContent =
            "Hay que mantener la vara alta amor, estas a la altura";
    } else {
        finalTitle.textContent = "Hay que practicar más amor";
        finalMessage.textContent =
            "Pero significa que aprendidiste, la próxima ya no te agarro desprevenida";
    }
}

startButton.addEventListener("click", function () {
    currentRound = 0;
    score = 0;

    showScreen(gameScreen);
    loadRound();
});

restartButton.addEventListener("click", function () {
    currentRound = 0;
    score = 0;

    showScreen(gameScreen);
    loadRound();
});
