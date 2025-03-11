export async function getWeather(latitude = 51.5074, longitude = -0.1278) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await response.json();
  
      if (!response.ok) throw new Error("Error fetching weather data");
  
      // Rain or Strong wind = "stormy"
      const weatherCondition =
        data.current_weather.weathercode < 3 ? "clear" : "stormy";
  
      return weatherCondition; 
    } catch (error) {
      console.error("Weather API Error:", error);
      return null;
    }
  }
  
