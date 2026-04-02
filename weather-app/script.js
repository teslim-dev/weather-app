function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("result");

  if (!city) {
    result.innerText = "Please enter a city";
    return;
  }

  result.innerText = "Loading...";

  fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1")
    .then(res => res.json())
    .then(geoData => {

      console.log(geoData);

      if (!geoData.results || geoData.results.length === 0) {
        result.innerText = "City not found ❌";
        return;
      }

      const lat = geoData.results[0].latitude;
      const lon = geoData.results[0].longitude;
      const name = geoData.results[0].name;

      return fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true")
        .then(res => res.json())
        .then(weatherData => {

          console.log(weatherData);

          // 🌤 NEW ICON LOGIC STARTS HERE
          const temp = weatherData.current_weather.temperature;
          const code = weatherData.current_weather.weathercode;

          let icon = "🌤";

          if (code === 0) icon = "☀️";
          else if (code <= 3) icon = "☁️";
          else if (code <= 67) icon = "🌧";
          else if (code <= 77) icon = "❄️";
          else if (code <= 99) icon = "⛈";

          result.innerHTML = `
            <h2>${name}</h2>
            <p style="font-size:40px">${icon}</p>
            <p>🌡 ${temp}°C</p>
          `;
          // 🌤 NEW ICON LOGIC ENDS HERE

        });

    })
    .catch(error => {
      console.log(error);
      result.innerText = "Error loading weather ❌";
    });
}

function getLocationWeather() {
  const result = document.getElementById("result");

  if (!navigator.geolocation) {
    result.innerText = "Geolocation not supported ❌";
    return;
  }

  result.innerText = "Getting your location...";

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true")
      .then(res => res.json())
      .then(data => {

        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        let icon = "🌤";

        if (code === 0) icon = "☀️";
        else if (code <= 3) icon = "☁️";
        else if (code <= 67) icon = "🌧";
        else if (code <= 77) icon = "❄️";
        else if (code <= 99) icon = "⛈";

        result.innerHTML = `
          <h2>Your Location</h2>
          <p style="font-size:40px">${icon}</p>
          <p>🌡 ${temp}°C</p>
        `;
      });

  }, () => {
    result.innerText = "Location access denied ❌";
  });
}
getLocationWeather();