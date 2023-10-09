// `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
async function findLonLat({ cityName, stateCode, countryCode }) {
  const res =
    await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=1&appid=50e0697d4406b2fc7f237f4900b3ae2e
    `);
  if (res.ok) {
    const data = await res.json();
    let latitude = data[0]["lat"];
    latitude = latitude.toFixed(2);
    let longitude = data[0]["lon"];
    longitude = longitude.toFixed(2);
    return { latitude, longitude };
  } else window.alert("fetch unsuccessful");
}

async function getWeather({ latitude: lat, longitude: lon }) {
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=50e0697d4406b2fc7f237f4900b3ae2e`
  );
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    const tempData = data.list[0].main;
    const weatherData = data.list[0].weather[0];
    const cloudData = data.list[0].clouds.all;
    const windData = data.list[0].wind;
    return {
      tempData: tempData,
      weatherData: weatherData,
      cloudData: cloudData,
      windData: windData,
    };
  } else window.alert("Bad Connection");
}

async function createLayout() {
  const formInfo = {
    cityName: `${document.getElementById("city-name").value}`,
    stateCode: `${document.getElementById("state-code").value}`,
    countryCode: `${document.getElementById("country-code").value}`,
  };
  const latLon = await findLonLat(formInfo);
  document.body.innerHTML = "";
  const getWeaterData = await getWeather(latLon);
  const container = document.createElement("div");
  document.body.appendChild(container);
  container.id = "container"
  document.getElementById("container").style.color = "white";
  document.getElementById("container").style.backgroundColor = "black";
  container.style.textAlign = "center";
  container.style.padding = "10px";
  container.style.width = "25%";
  const h1 = document.createElement("h1");
  container.appendChild(h1);
  h1.innerText = "Weather Data:\n";
  const p = document.createElement("p");
  container.appendChild(p);
  p.id = "weather-text";
  p.innerText = `High of the day: ${kelvinToFarenheit(
    getWeaterData.tempData.temp_max.toFixed(2)
  )} degrees Farenheight\nLow of the day: ${kelvinToFarenheit(
    getWeaterData.tempData.temp_min.toFixed(2)
  )} degrees Farenheight\nWeather: ${
    getWeaterData.weatherData.description
  }\nWind: ${getWeaterData.windData.speed} Knots at ${
    getWeaterData.windData.deg
  } Degrees, Gusting ${getWeaterData.windData.gust} Knots\nHumidity: ${
    getWeaterData.tempData.humidity
  }%\n\n*click on the 'Swap' button to switch between light and dark mode*`;
  const backgroundImage = pickBackgroundImage(getWeaterData.weatherData.main);
  document.body.style.backgroundImage = `url(${backgroundImage})`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  const exitButton = document.createElement("input");
  document.body.appendChild(exitButton);
  exitButton.type = "button";
  exitButton.name = "exit-button";
  exitButton.id = "exit-button";
  exitButton.value = "Exit";
  exitButton.addEventListener("click", startOver);
  const darkLightButton = document.createElement("input")
  document.body.appendChild(darkLightButton)
  darkLightButton.type = "button"
  darkLightButton.name = "swap-button"
  darkLightButton.id = "swap-button"
  darkLightButton.value = "Swap"
  darkLightButton.addEventListener("click", darkLight)
}

function kelvinToFarenheit(tempK) {
  let temp = ((tempK - 273.15) * 9) / 5 + 32;
  temp = temp.toFixed(2);
  return temp;
}

function pickBackgroundImage(descriptor) {
  if (descriptor == "Snow") {
    return "./images/SNOW.webp";
  } else if (descriptor == "Clouds") {
    return "./images/CLOUDY.webp";
  } else if (descriptor == "Sun") {
    return "./images/SUNNY.webp";
  } else if (descriptor == "Rain") {
    return "./images/RAINY.avif";
  } else if (descriptor == "Wind") {
    return "./images/WINDY.jpg";
  } else if (descriptor == "Clear") {
    return "./images/CLEAR.jpg";
  } else {
    return "./images/EMPTY.jpg";
  }
}

function startOver() {
  document.body.innerHTML = `
<form action="" id="container">
    <label for="city-name">Type "city name", "state code"(if in US: ex. Mi), and "country code"(use ISO 3166 country codes)</label>
    <input type="text" name="city-name" id="city-name" />
    <input type="text" name="state-code" id="state-code" />
    <input type="text" name="country-code" id="country-code" />
    <input type="button" name="submit-button" id="submit-button" value="Submit" onclick="createLayout()" />
</form>`;
  document.body.style.backgroundImage = "initial";
}

function darkLight(){
    switch(document.getElementById("container").style.color){
    case "black":
        document.getElementById("container").style.color = "white";
        document.getElementById("container").style.backgroundColor = "black";
        break;
    case "white":
        document.getElementById("container").style.color = "black";
        document.getElementById("container").style.backgroundColor = "white";
        break;
    }
}