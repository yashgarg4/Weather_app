document.addEventListener('DOMContentLoaded', () => {
    const getWeatherButton = document.getElementById('get-weather-btn');
    const zipcode_input_element = document.getElementById('zipcode-input');
    const countrycode_input_element = document.getElementById('countrycode-input');
    const weatherDetailsDiv = document.getElementById('weather-details');
    const cityNameElement = document.getElementById('city-name');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const weatherIconElement = document.getElementById('weather-icon');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessageElement = document.getElementById('error-message');

    const apiKey = '25fea628be91aa147881cd5b1c0c9044'; 

    getWeatherButton.addEventListener('click', fetchWeather);
    zipcode_input_element.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchWeather();
        }
    });
    // Add event listener for Enter key on country code input
    countrycode_input_element.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchWeather();
        }
    });

    async function fetchWeather() {
        const zipCode = zipcode_input_element.value.trim();
        const countryCode = countrycode_input_element ? countrycode_input_element.value.trim().toUpperCase() : '';

        if (!zipCode) {
            displayError("Please enter a zip/postcode.");
            return;
        }
        
        // Validate country code if provided (e.g., 2-letter ISO code)
        if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) {
            displayError("Please enter a valid 2-letter ISO country code (e.g., US, GB, FR).");
            return;
        }

        let apiZipQuery;
        if (countryCode) {
            apiZipQuery = `${zipCode},${countryCode}`;
        } else {
            apiZipQuery = `${zipCode},us`; 
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${apiZipQuery}&appid=${apiKey}&units=metric`;

        showLoading(true);
        clearPreviousData();
        try {
            if (apiKey === 'YOUR_API_KEY') {
                displayError("API Key not configured. Please replace 'YOUR_API_KEY' in script.js with your OpenWeatherMap API key.");
                showLoading(false);
                return;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            showLoading(false);

            if (response.ok) {
                if (data.cod === 200) { 
                    displayWeatherData(data);
                } else {
                    displayError(data.message || "Could not retrieve weather data for this zipcode.");
                }
            } else {
                if (data && data.message) {
                    displayError(`Error: ${data.message}`);
                } else {
                    displayError(`Error: ${response.status} - ${response.statusText}. Please check the zipcode or API key.`);
                }
            }
        } catch (error) {
            showLoading(false);
            console.error('Fetch error:', error);
            displayError("Failed to fetch weather data. Check your network connection or the API endpoint.");
        }
    }

    function displayWeatherData(data) {
        weatherDetailsDiv.classList.add('visible');
        weatherDetailsDiv.classList.remove('hidden');
        errorMessageElement.classList.remove('visible');
        errorMessageElement.classList.add('hidden');

        cityNameElement.textContent = data.name;
        temperatureElement.textContent = `Temperature: ${data.main.temp}°C`;
        descriptionElement.textContent = `Weather: ${data.weather[0].main} (${data.weather[0].description})`;

        const iconCode = data.weather[0].icon;
        weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconElement.alt = data.weather[0].description;
    }

    function displayError(message) {
        weatherDetailsDiv.classList.remove('visible');
        weatherDetailsDiv.classList.add('hidden');
        errorMessageElement.textContent = message;
        errorMessageElement.classList.add('visible');
        errorMessageElement.classList.remove('hidden');
    }

    function clearPreviousData() {
        errorMessageElement.classList.remove('visible');
        errorMessageElement.classList.add('hidden'); 
        weatherDetailsDiv.classList.remove('visible');
        weatherDetailsDiv.classList.add('hidden');
    }

    function showLoading(isLoading) {
        loadingMessage.classList.toggle('visible', isLoading);
        loadingMessage.classList.toggle('hidden', !isLoading); 
        getWeatherButton.disabled = isLoading;
        zipcode_input_element.disabled = isLoading;
        if (countrycode_input_element) {
            countrycode_input_element.disabled = isLoading;
        }
    }
});