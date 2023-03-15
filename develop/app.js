const form = document.querySelector("form");
const forecastDiv = document.querySelector("#forecast");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = form.elements.city.value.trim();
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1303bd8eb533f3f2ce0b0ba1a20c750c&units=imperial`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.list;
      const cityName = data.city.name;

      let forecastHTML = `<h2>${cityName}</h2>`;

      forecastData.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
        const time = date.toLocaleTimeString("en-US", { timeStyle: "short" });
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temp = Math.round(forecast.main.temp);

        forecastHTML += `
          <div>
            <p>${weekday} ${time}</p>
            <p><img src="${icon}" alt="${forecast.weather[0].description}">${temp}°C</p>
          </div>
        `;
      });

      forecastDiv.innerHTML = forecastHTML;
    })
    .catch((error) => {
      console.error(error);
      forecastDiv.innerHTML =
        "<p>Sorry, something went wrong. Please try again later.</p>";
    });
});
