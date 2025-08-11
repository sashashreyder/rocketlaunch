export function getRandomConditions() {

    return {
      fuel: Math.random() > 0.1 ? "full" : "low", // 90% chance of "full", 10% chance of "low"
      astronautHealth: Math.random() > 0.2 ? "healthy" : "sick", // 80% chance of "healthy", 20% chance of "sick"
      technicalStatus: Math.random() > 0.3 ? "optimal" : "error", // 70% chance of "optimal", 30% chance of "error"
    };
  }
   
  export function checkLaunchConditions(conditions) {
    
    return (
      conditions.weather === "clear" && // API
      conditions.fuel === "full" &&
      conditions.astronautHealth === "healthy" &&
      conditions.technicalStatus === "optimal"
    );
  }

// Enhanced cosmic launch conditions
export function checkCosmicLaunchConditions(conditions) {
  // Keep original logic as primary requirement
  const basicConditions = checkLaunchConditions(conditions);
  
  // Add cosmic factors as additional safety checks
  const cosmicConditions = 
    conditions.solarActivity?.severity !== 'high' &&
    conditions.spaceDebris?.riskLevel !== 'high' &&
    conditions.cosmicRadiation?.status !== 'high' &&
    conditions.astronomical?.isDay !== false; // Prefer daytime launches
  
  // Launch only if basic conditions are met AND cosmic conditions are favorable
  return basicConditions && cosmicConditions;
}

// Get cosmic condition status for display
export function getCosmicStatus(conditions) {
  if (!conditions) return { status: 'unknown', description: 'Loading cosmic data...' };
  
  const issues = [];
  
  if (conditions.solarActivity?.severity === 'high') {
    issues.push('High solar activity');
  }
  if (conditions.spaceDebris?.riskLevel === 'high') {
    issues.push('High debris risk');
  }
  if (conditions.cosmicRadiation?.status === 'high') {
    issues.push('High radiation levels');
  }
  if (conditions.astronomical?.isDay === false) {
    issues.push('Nighttime conditions');
  }
  
  if (issues.length === 0) {
    return { status: 'optimal', description: 'All cosmic conditions optimal' };
  } else {
    return { status: 'caution', description: `Issues: ${issues.join(', ')}` };
  }
}
   
 