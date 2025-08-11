import { useState, useEffect } from "react";
import { getWeather } from "./weatherApi";
import { getRandomConditions, checkLaunchConditions, checkCosmicLaunchConditions, getCosmicStatus } from "./launchConditions";
import { getISSLocation, getSolarActivity, getAstronomicalData, getSpaceDebrisRisk, getCosmicRadiation } from "./spaceApis";
import "./App.css";

function App() {
  const [launch, setLaunch] = useState(10);
  const [conditions, setConditions] = useState(null);
  const [isReadyToLaunch, setIsReadyToLaunch] = useState(false);
  const [launchStarted, setLaunchStarted] = useState(false); // Fix successful launch state

  const [location, setLocation] = useState(null); // Store user's coordinates
  const [city, setCity] = useState(null); // Store user's city

  // New cosmic data states
  const [issLocation, setIssLocation] = useState(null);
  const [solarActivity, setSolarActivity] = useState(null);
  const [astronomical, setAstronomical] = useState(null);
  const [spaceDebris, setSpaceDebris] = useState(null);
  const [cosmicRadiation, setCosmicRadiation] = useState(null);

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

// Fetch cosmic data
useEffect(() => {
  if (!location) return;

  const fetchCosmicData = async () => {
    try {
      const [iss, solar, astro, debris, radiation] = await Promise.all([
        getISSLocation(),
        getSolarActivity(),
        getAstronomicalData(location.latitude, location.longitude),
        getSpaceDebrisRisk(),
        getCosmicRadiation()
      ]);

      setIssLocation(iss);
      setSolarActivity(solar);
      setAstronomical(astro);
      setSpaceDebris(debris);
      setCosmicRadiation(radiation);
    } catch (error) {
      console.error("Error fetching cosmic data:", error);
    }
  };

  fetchCosmicData();
  const cosmicInterval = setInterval(fetchCosmicData, 30000); // Update every 30 seconds

  return () => clearInterval(cosmicInterval);
}, [location]);

  useEffect(() => {
    if (launchStarted) return; // Once the launch has started, stop updating conditions
      const conditionInterval = setInterval(async () => {
      const weather = await getWeather(); // API
      if (!weather) return; // Skips if error

      const newConditions = { 
        ...getRandomConditions(), 
        weather,
        // Add cosmic data to conditions
        solarActivity,
        spaceDebris,
        cosmicRadiation,
        astronomical
      }; // Add weather to conditions
      setConditions(newConditions);
      
      // Use enhanced cosmic launch conditions
      setIsReadyToLaunch(checkCosmicLaunchConditions(newConditions));
    }, 2000); // Change conditions every 10 seconds

    return () => clearInterval(conditionInterval); // Clean the interval
  }, [launchStarted, solarActivity, spaceDebris, cosmicRadiation, astronomical]);

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

  // Get cosmic status for display
  const cosmicStatus = getCosmicStatus(conditions);

  return (
    <div className="cosmic-container">
      <div className="stars"></div>
      <div className="twinkling"></div>
      
      <h1 className="cosmic-title">🚀 Rocket Launcher</h1>
      
      <div className="main-launch-card">
        <h2 className="countdown">Countdown: {launch > 0 ? launch : "🚀 Let's Go!"}</h2>
        <button className="launch-button" onClick={resetSystem} disabled={!launchStarted}>
          Try Again
        </button>
        
        <h3>🚀 Launch Conditions:</h3>
        <ul className="conditions-list">
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
        
        <p className="launch-status">Status: {isReadyToLaunch ? "✅ Ready to launch!" : "❌ Not ready to launch!"}</p>
        <h3>📍 Location: {city ? city : "Detecting..."}</h3>
      </div>

      {/* Cosmic Data Dashboard */}
      <div className="cosmic-dashboard">
        <h3>🌌 Cosmic Launch Environment</h3>
        
        <div className="cosmic-grid">
          {/* Solar Activity */}
          <div className="cosmic-card solar">
            <h4>☀️ Solar Activity</h4>
            {solarActivity ? (
              <div>
                <p>Status: <span className={`status-${solarActivity.severity}`}>{solarActivity.severity}</span></p>
                <p>Activity: {solarActivity.activity}</p>
                <p>{solarActivity.description}</p>
              </div>
            ) : (
              <p>Loading solar data...</p>
            )}
          </div>

          {/* Space Debris */}
          <div className="cosmic-card debris">
            <h4>🛰️ Space Debris</h4>
            {spaceDebris ? (
              <div>
                <p>Count: {spaceDebris.debrisCount}</p>
                <p>Risk: <span className={`risk-${spaceDebris.riskLevel}`}>{spaceDebris.riskLevel}</span></p>
                <p>{spaceDebris.riskDescription}</p>
              </div>
            ) : (
              <p>Loading debris data...</p>
            )}
          </div>

          {/* Cosmic Radiation */}
          <div className="cosmic-card radiation">
            <h4>☢️ Cosmic Radiation</h4>
            {cosmicRadiation ? (
              <div>
                <p>Level: {cosmicRadiation.level} {cosmicRadiation.unit}</p>
                <p>Status: <span className={`radiation-${cosmicRadiation.status}`}>{cosmicRadiation.status}</span></p>
                <p>{cosmicRadiation.description}</p>
              </div>
            ) : (
              <p>Loading radiation data...</p>
            )}
          </div>

          {/* Astronomical Data */}
          <div className="cosmic-card astronomical">
            <h4>🌙 Astronomical</h4>
            {astronomical ? (
              <div>
                <p>{astronomical.moonPhase}</p>
                <p>🌅 Sunrise: {astronomical.sunrise}</p>
                <p>🌇 Sunset: {astronomical.sunset}</p>
                <p>Day Length: {astronomical.dayLength}h</p>
              </div>
            ) : (
              <p>Loading astronomical data...</p>
            )}
          </div>

          {/* ISS Location */}
          <div className="cosmic-card iss">
            <h4>🛸 ISS Location</h4>
            {issLocation ? (
              <div>
                <p>Lat: {issLocation.latitude.toFixed(2)}°</p>
                <p>Lon: {issLocation.longitude.toFixed(2)}°</p>
                <p>Updated: {issLocation.timestamp.toLocaleTimeString()}</p>
              </div>
            ) : (
              <p>Loading ISS data...</p>
            )}
          </div>

          {/* Cosmic Status Summary */}
          <div className="cosmic-card status-summary">
            <h4>🌠 Cosmic Status</h4>
            <div className={`cosmic-status-${cosmicStatus.status}`}>
              <p>{cosmicStatus.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;




