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

  