const form = document.querySelector("form");
const forecastDiv = document.querySelector("#forecast");
const box1 = document.querySelector("#box1");
const box2 = document.querySelector("#box2");
const box3 = document.querySelector("#box3");
const box4 = document.querySelector("#box4");
const box5 = document.querySelector("#box5");
const searchHistoryDiv = document.querySelector("#search-history");
let searchHistory = new Set();

if (localStorage.getItem("searchHistory")) {
  const searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));
  searchHistory = new Set(searchHistoryArray);
}

function renderSearchHistory() {
  const searchHistoryArray = Array.from(searchHistory);
  searchHistoryDiv.innerHTML = "";
  searchHistoryArray.forEach((city) => {
    const button = document.createElement("button");
    button.textContent = city;
    button.addEventListener("click", () => {
      form.elements.city.value = city;
      form.dispatchEvent(new Event("submit"));
    });
    searchHistoryDiv.appendChild(button);
  });
}

window.addEventListener("load", () => {
  renderSearchHistory();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = form.elements.city.value.trim();
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1303bd8eb533f3f2ce0b0ba1a20c750c&units=imperial`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.list;
      const cityName = data.city.name;
      let currentDate = "";

      searchHistory.add(cityName);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(Array.from(searchHistory))
      );

      renderSearchHistory();

      forecastData.forEach((forecast, index) => {
        if (index % 8 === 0) {
          const date = new Date(forecast.dt * 1000);
          const formattedDate = date.toLocaleDateString("en-US");
          const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
          const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
          const temp = Math.round(forecast.main.temp);

          const box = eval(`box${Math.floor(index / 8) + 1}`);
          const boxHTML = `
          <p>${weekday}</p>
          <p><img src="${icon}" alt="${forecast.weather[0].description}">${temp}°F</p>
          <p>Wind: ${forecast.wind.speed} mph</p>
          <p>Humidity: ${forecast.main.humidity}%</p>
          `;
          box.innerHTML = boxHTML;
        }
      });
    })
    .catch((error) => {
      console.error(error);
      forecastDiv.innerHTML =
        "<p>Sorry, something went wrong. Please try again later.</p>";
    });
});
