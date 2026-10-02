const apiKey = "d6f4251b297f3eb0fd7307c0ac840de2";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const suggestionsBox = document.getElementById("suggestions");
const weatherBox = document.getElementById("weatherBox");
const errorBox = document.getElementById("errorBox");
const errorMsg = document.getElementById("errorMsg");
const weatherIcon = document.getElementById("weatherIcon");

const uzbekistanCities = [
  "Toshkent", "Andijon", "Namangan", "Farg'ona", "Qo'qon", "Qoqon",
  "Samarqand", "Buxoro", "Navoiy", "Qarshi", "Termiz", "Urganch",
  "Xiva", "Nukus", "Jizzax", "Guliston", "Angren", "Chirchiq",
  "Bekobod", "Yangiyol", "Qibray", "Shahrisabz", "Kogon", "Khiva",
  "Karakalpakstan", "Olmaliq", "Kosonsoy", "Fargona", "Muborak", "Turtkul"
];

const weatherEmojis = {
  "Clear": "☀️",
  "Clouds": "☁️",
  "Rain": "🌧️",
  "Drizzle": "🌦️",
  "Mist": "🌫️",
  "Fog": "🌫️",
  "Haze": "🌫️",
  "Snow": "❄️",
  "Thunderstorm": "⛈️",
  "Smoke": "🌫️",
  "Dust": "🌪️",
  "Sand": "🌪️",
  "Ash": "🌋",
  "Squall": "🌬️",
  "Tornado": "🌪️"
};

function setBodyTheme(condition) {
  const key = condition.toLowerCase();
  document.body.className = "";
  document.body.classList.add(key);
}

function renderSuggestions(value) {
  const query = value.trim().toLowerCase();
  if (!query) {
    suggestionsBox.style.display = "none";
    return;
  }

  const filtered = uzbekistanCities.filter(city =>
    city.toLowerCase().startsWith(query)
  );

  if (filtered.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestionsBox.innerHTML = filtered
    .slice(0, 6)
    .map(city => `
      <div class="suggestion-item" data-city="${city}">
        ${city}
      </div>
    `)
    .join("");

  suggestionsBox.style.display = "block";

  suggestionsBox.querySelectorAll(".suggestion-item").forEach(item => {
    item.addEventListener("click", () => {
      cityInput.value = item.dataset.city;
      suggestionsBox.style.display = "none";
      checkWeather(item.dataset.city);
    });
  });
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.remove("hidden");
  weatherBox.classList.add("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

function displayWeather(data) {
  const { main, weather, wind, name, sys } = data;
  const condition = weather[0].main;

  document.getElementById("temp").textContent = `${Math.round(main.temp)}°C`;
  document.getElementById("description").textContent = condition;
  document.getElementById("city").textContent = name;
  document.getElementById("country").textContent = sys.country;
  document.getElementById("humidity").textContent = `${main.humidity}%`;
  document.getElementById("wind").textContent = `${Math.round(wind.speed)} km/h`;
  document.getElementById("feelsLike").textContent = `${Math.round(main.feels_like)}°C`;
  document.getElementById("pressure").textContent = `${main.pressure} hPa`;

  weatherIcon.textContent = weatherEmojis[condition] || "☁️";
  setBodyTheme(condition);

  hideError();
  weatherBox.classList.remove("hidden");
}

async function checkWeather(city) {
  const value = city.trim();

  if (!value) {
    showError("Iltimos, shahar nomini kiriting!");
    return;
  }

  try {
    const response = await fetch(apiUrl + value + `&appid=${apiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Shahar topilmadi");
    }

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    console.error(error);
    showError(`"${value}" shahar topilmadi. Boshqa nom kiriting.`);
  }
}

cityInput.addEventListener("input", (event) => {
  renderSuggestions(event.target.value);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const value = cityInput.value.trim();
    suggestionsBox.style.display = "none";
    checkWeather(value);
  }
});

searchBtn.addEventListener("click", () => {
  const value = cityInput.value.trim();
  suggestionsBox.style.display = "none";
  checkWeather(value);
});

refreshBtn.addEventListener("click", () => {
  const value = cityInput.value.trim() || "Toshkent";
  checkWeather(value);
});

window.addEventListener("load", () => {
  cityInput.value = "Toshkent";
  checkWeather("Toshkent");
});