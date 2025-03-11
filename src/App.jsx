import { useState, useEffect } from "react";
import { getWeather } from "./weatherApi";
import { getRandomConditions, checkLaunchConditions } from "./launchConditions";
import "./App.css";

function App() {
  const [launch, setLaunch] = useState(10);
  const [conditions, setConditions] = useState(null);
  const [isReadyToLaunch, setIsReadyToLaunch] = useState(false);
  const [launchStarted, setLaunchStarted] = useState(false); // Fix successful launch state

  const [location, setLocation] = useState(null); // Store user's coordinates
  const [city, setCity] = useState(null); // Store user's city

  
// Get user's location
useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude }); // Save user's coordinates
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}, []);

// Get city name based on coordinates
useEffect(() => {
  if (!location) {
    console.log("Waiting for location...");
    return;
  }

  console.log("Fetching city for:", location.latitude, location.longitude);

  const fetchCityName = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&accept-language=en`
      );
      const data = await response.json();

      if (data && data.address) {
        console.log("API response:", data.address);
      
        setCity(
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          data.address.suburb || 
          "Unknown location"
        );
      } else {
        console.log("City not found in API response");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  fetchCityName();
}, [location]); // Runs when location updates


  useEffect(() => {
    if (launchStarted) return; // Once the launch has started, stop updating conditions
      const conditionInterval = setInterval(async () => {
      const weather = await getWeather(); // API
      if (!weather) return; // Skips if error

      const newConditions = { ...getRandomConditions(), weather }; // Add weather to conditions
      setConditions(newConditions);
      setIsReadyToLaunch(checkLaunchConditions(newConditions));
    }, 2000); // Change conditions every 10 seconds

    return () => clearInterval(conditionInterval); // Clean the interval
  }, [launchStarted]);

  // Check if conditions are met and lock the launch status
  useEffect(() => {
    if (!isReadyToLaunch || launch === 0 || launchStarted) return; // Exit the function earlier than code below

    setLaunchStarted(true); // Lock conditions and confirm launch

  }, [isReadyToLaunch]); // Runs only when conditions become ready (dependencies array)

  // Start the countdown when launch is confirmed
  useEffect(() => {
    if (!launchStarted || launch === 0) return; // Only runs if the launch is confirmed

    const launchTimer = setInterval(() => {
      setLaunch((prevLaunch) => prevLaunch - 1);
    }, 1000); // Decrease the countdown every second

    return () => clearInterval(launchTimer); // Cleanup when launch reaches 0 or component unmounts

  }, [launchStarted, launch]); // Runs when launch starts or countdown updates
         
  // Reset the system and retry the launch
  const resetSystem = () => {
    setLaunch(10);
    setLaunchStarted(false);
    setIsReadyToLaunch(false);
    setConditions(null);
  };

  return (
    <>
      <h1>🚀 Rocket Launcher</h1>
      <div className="card">
        <h2>Countdown: {launch > 0 ? launch : "🚀 Let's Go!"}</h2>
        <button onClick={resetSystem} disabled={!launchStarted}>
          Try Again
        </button>
        <h3>Conditions:</h3>
        <ul>
          {conditions ? (
            <>
              <li>🌤 Weather: {conditions.weather}</li>
              <li>⛽ Fuel: {conditions.fuel}</li>
              <li>🧑‍🚀 Astronaut Health: {conditions.astronautHealth}</li>
              <li>🔧 Technical Status: {conditions.technicalStatus}</li>
            </>
          ) : (
            <p>Loading conditions...</p>
          )}
        </ul>
        <p>Status: {isReadyToLaunch ? "✅ Ready to launch!" : "❌ Not ready to launch!"}</p>
        <h3>📍 Location: {city ? city : "Detecting..."}</h3>
      </div>
    </>
  );
}

export default App;




