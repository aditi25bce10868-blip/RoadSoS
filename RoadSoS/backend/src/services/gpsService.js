function estimateETA(distanceKm, speedKmh = 40) {
  const minutes = (distanceKm / speedKmh) * 60;
  return Math.round(minutes);
}

module.exports = { estimateETA };
