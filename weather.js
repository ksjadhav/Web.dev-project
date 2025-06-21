const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

document.getElementById('weatherForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.textContent = "Loading...";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            resultDiv.textContent = "City not found or API error.";
            return;
        }
        const data = await response.json();
        resultDiv.innerHTML = `
            <strong>${data.name}, ${data.sys.country}</strong><br>
            ${data.weather[0].main} (${data.weather[0].description})<br>
            🌡️ ${data.main.temp}°C (feels like ${data.main.feels_like}°C)<br>
            💧 Humidity: ${data.main.humidity}%<br>
            🌬️ Wind: ${data.wind.speed} m/s
        `;
    } catch (err) {
        resultDiv.textContent = "Error fetching weather data.";
    }
});