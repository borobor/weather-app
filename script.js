const API = {
  getInfo() {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=rijeka&appid=8ac22db206441049bffad87b92e884d8`
    );
  },
};

window.onload = () => {
	getWeatherData();
	const refreshBtn = document.querySelector(".refresh");
	refreshBtn.addEventListener("click", getWeatherData);
	const unitBtn = document.querySelector(".temp-unit");
	unitBtn.addEventListener("click", changeTempUnit);
}

function getWeatherData() {
	async function fetchData() {
		const response = await API.getInfo();
		const data = await response.json();
		//use object destructuring to only get important data
		const { name, main, weather } = data;
		//idea: add the date of last weather update!
		// const date = new Date(Date.now());
		// console.log(date);
		return { name, main, weather };
	}
	
	fetchData().then((data) => {
		const city = data.name;
		const tempK = data.main.temp;
		const pressure = data.main.pressure;
		const forecast = data.weather[0].main;
	
		const tempC = Math.round((tempK - 273) * 10) / 10;
		const tempF = Math.round(((tempC*9/5)+32)*10)/10;
	
		const weatherData = { city, tempC, tempF, pressure, forecast };
		showData(weatherData);
	});
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
		tempF = Math.round(tempF*10)/10;
    divTemp.textContent = `${tempF} °F`;
    divTemp.dataset.info = "tempF";
  }
  if (currentUnit === "tempF") {
		let temp = divTemp.textContent.split(" ")[0];
    let tempC = ((temp - 32) * 5) / 9;
		tempC = Math.round(tempC*10)/10;
    divTemp.textContent = `${tempC} °C`;
    divTemp.dataset.info = "tempC";
  }
}


