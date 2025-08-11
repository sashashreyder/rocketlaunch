// Space APIs for enhanced rocket launch experience

// ISS (International Space Station) Location API
export async function getISSLocation() {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    const data = await response.json();
    
    if (data && data.iss_position) {
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: new Date(data.timestamp * 1000)
      };
    }
    return null;
  } catch (error) {
    console.error("ISS API Error:", error);
    return null;
  }
}

// Solar Activity and Space Weather API
export async function getSolarActivity() {
  try {
    const response = await fetch('https://api.nasa.gov/DONKI/WSA?startDate=' + 
      new Date().toISOString().split('T')[0] + '&endDate=' + 
      new Date().toISOString().split('T')[0] + '&api_key=DEMO_KEY');
    const data = await response.json();
    
    if (data && data.length > 0) {
      const latest = data[0];
      return {
        activity: latest.activityID || 'normal',
        severity: latest.severity || 'low',
        source: latest.sourceLocation || 'unknown',
        description: latest.description || 'No significant solar activity'
      };
    }
    return { activity: 'normal', severity: 'low', source: 'none', description: 'Quiet solar conditions' };
  } catch (error) {
    console.error("Solar Activity API Error:", error);
    return { activity: 'unknown', severity: 'unknown', source: 'unknown', description: 'Unable to fetch solar data' };
  }
}

// Astronomical Data - Moon Phase and Sun Position
export async function getAstronomicalData(latitude, longitude) {
  try {
    const now = new Date();
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${now.toISOString().split('T')[0]}&formatted=0`);
    const data = await response.json();
    
    if (data && data.results) {
      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);
      const now = new Date();
      
      // Calculate moon phase (simplified)
      const moonPhase = calculateMoonPhase(now);
      
      return {
        sunrise: sunrise.toLocaleTimeString(),
        sunset: sunset.toLocaleTimeString(),
        moonPhase: moonPhase,
        isDay: now > sunrise && now < sunset,
        dayLength: Math.round((sunset - sunrise) / (1000 * 60 * 60))
      };
    }
    return null;
  } catch (error) {
    console.error("Astronomical API Error:", error);
    return null;
  }
}

// Calculate moon phase (simplified algorithm)
function calculateMoonPhase(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
  const phase = ((year * 12 + month) * 29.53 + day) % 29.53;
  
  if (phase < 3.69) return "🌑 New Moon";
  if (phase < 11.04) return "🌒 Waxing Crescent";
  if (phase < 18.39) return "🌓 First Quarter";
  if (phase < 25.74) return "🌔 Waxing Gibbous";
  if (phase < 29.53) return "🌕 Full Moon";
  return "🌑 New Moon";
}

// Space Debris and Collision Risk (simplified simulation)
export async function getSpaceDebrisRisk() {
  try {
    // Simulate space debris data since real APIs require authentication
    const debrisCount = Math.floor(Math.random() * 1000) + 500;
    const riskLevel = debrisCount > 800 ? 'high' : debrisCount > 600 ? 'medium' : 'low';
    
    return {
      debrisCount: debrisCount,
      riskLevel: riskLevel,
      riskDescription: riskLevel === 'high' ? 'Elevated collision risk detected' : 
                      riskLevel === 'medium' ? 'Moderate debris density' : 'Clear orbital path'
    };
  } catch (error) {
    console.error("Space Debris API Error:", error);
    return { debrisCount: 0, riskLevel: 'unknown', riskDescription: 'Unable to assess debris risk' };
  }
}

// Cosmic Radiation Levels (simplified simulation)
export async function getCosmicRadiation() {
  try {
    // Simulate cosmic radiation data
    const radiationLevel = Math.random() * 100;
    let status, description;
    
    if (radiationLevel < 30) {
      status = 'low';
      description = 'Safe radiation levels for launch';
    } else if (radiationLevel < 70) {
      status = 'moderate';
      description = 'Elevated radiation, proceed with caution';
    } else {
      status = 'high';
      description = 'High radiation levels detected';
    }
    
    return {
      level: Math.round(radiationLevel),
      status: status,
      description: description,
      unit: 'μSv/h'
    };
  } catch (error) {
    console.error("Cosmic Radiation API Error:", error);
    return { level: 0, status: 'unknown', description: 'Unable to measure radiation', unit: 'μSv/h' };
  }
}
