const API = {
  url: "https://api.openweathermap.org/data/2.5/weather?appid=8ac22db206441049bffad87b92e884d8",
  city: "Rijeka",
  getInfo() {
    return fetch(this.url + `&q=${this.city}`);
  },
};

window.onload = () => {
  getWeatherData();
  const refreshBtn = document.querySelector(".refresh");
  refreshBtn.addEventListener("click", getWeatherData);
  const unitBtn = document.querySelector(".temp-unit");
  unitBtn.addEventListener("click", changeTempUnit);
  const searchBtn = document.querySelector(".search");
  searchBtn.addEventListener("click", openSearchBar, { once: true });
};

function getWeatherData() {
  (async function fetchData() {
    try {
      const response = await API.getInfo();
      if (response.ok) {
        const data = await response.json();
        const city = data.name;
        const tempK = data.main.temp;
        const pressure = data.main.pressure;
        const forecast = data.weather[0].main;

        const tempC = Math.round((tempK - 273) * 10) / 10;
        const tempF = Math.round(((tempC * 9) / 5 + 32) * 10) / 10;

        const weatherData = { city, tempC, tempF, pressure, forecast };
        showData(weatherData);
      } else {
        alert(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      alert(err);
    }
  })();
}

function showData(weatherData) {
  const weatherWidget = document.querySelector(".widget");
  const children = [...weatherWidget.children];
  children.forEach((child) => {
    const divData = child.dataset.info;
    if (divData === "tempC") {
      child.textContent = `${weatherData[divData]} °C`;
      return;
    }
    if (divData === "tempF") {
      child.textContent = `${weatherData[divData]} °F`;
      return;
    }
    if (divData === "pressure") {
      child.textContent = `${weatherData[divData]} hPa`;
      return;
    }
    child.textContent = weatherData[divData];
  });
}

function changeTempUnit() {
  const divTemp = document.querySelector(".widget-temp");
  const currentUnit = divTemp.dataset.info;
  if (currentUnit === "tempC") {
    let temp = divTemp.textContent.split(" ")[0];
    let tempF = temp * (9 / 5) + 32;
    tempF = Math.round(tempF * 10) / 10;
    divTemp.textContent = `${tempF} °F`;
    divTemp.dataset.info = "tempF";
  }
  if (currentUnit === "tempF") {
    let temp = divTemp.textContent.split(" ")[0];
    let tempC = ((temp - 32) * 5) / 9;
    tempC = Math.round(tempC * 10) / 10;
    divTemp.textContent = `${tempC} °C`;
    divTemp.dataset.info = "tempC";
  }
}

function openSearchBar({ target }) {
  const searchBar = document.createElement("input");
  searchBar.classList.add("header-search");
	searchBar.setAttribute("placeholder", "city name...");
  const headerMenu = document.querySelector(".header-menu");
  headerMenu.insertBefore(searchBar, headerMenu.firstChild);
  setTimeout(() => searchBar.classList.add("show"), 30);
  searchBar.focus();
  target.addEventListener("click", searchCity, { once: true });
}

function searchCity({ target }) {
  const searchBar = document.querySelector("input");
  const city = searchBar.value;
  if (!city.length) {
    searchBar.parentElement.removeChild(searchBar);
    target.addEventListener("click", openSearchBar, { once: true });
    return;
  }
  API.city = city;
  searchBar.value = "";
  searchBar.parentElement.removeChild(searchBar);
  target.addEventListener("click", openSearchBar, { once: true });
  getWeatherData();
}
