const API = {
  getInfo() {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=rijeka&appid=8ac22db206441049bffad87b92e884d8`);
  }
}

async function fetchData() {
  const response = await API.getInfo();
  const data = await response.json()
  //use object destructuring to only get important data
  console.log(data);
  const { name, main, weather } = data;
  return { name, main, weather };
}

fetchData()
  .then(data => {
    const city = data.name;
    const tempF = data.main.temp;
    const pressure = data.main.pressure;
    const forecast = data.weather[0].main;
  
    const weatherData = {city, tempF, pressure, forecast}
  })
