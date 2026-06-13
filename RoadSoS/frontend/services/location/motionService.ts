// frontend/services/location/motionService.ts
import { Accelerometer, Gyroscope } from 'expo-sensors';

export interface MotionReading {
  ax: number; ay: number; az: number;  // accelerometer
  gx: number; gy: number; gz: number;  // gyroscope
  timestamp: number;
  magnitude: number;   // total acceleration magnitude
  gMagnitude: number;  // total gyroscope magnitude
}

export interface MotionSnapshot {
  current:  MotionReading;
  previous: MotionReading | null;
}

let accelSub: any = null;
let gyroSub:  any = null;

let lastAccel: any  = { x: 0, y: 0, z: 0 };
let lastGyro:  any  = { x: 0, y: 0, z: 0 };

/**
 * Start listening to motion sensors
 * @param onReading - called on every combined reading
 * @param intervalMs - polling interval
 */
export const startMotionListening = (
  onReading: (reading: MotionReading) => void,
  intervalMs = 200
) => {
  Accelerometer.setUpdateInterval(intervalMs);
  Gyroscope.setUpdateInterval(intervalMs);

  accelSub = Accelerometer.addListener((data) => {
    lastAccel = data;
  });

  gyroSub = Gyroscope.addListener((data) => {
    lastGyro = data;

    // Combine both sensors on gyro tick
    const magnitude  = Math.sqrt(lastAccel.x**2 + lastAccel.y**2 + lastAccel.z**2);
    const gMagnitude = Math.sqrt(lastGyro.x**2  + lastGyro.y**2  + lastGyro.z**2);

    onReading({
      ax: lastAccel.x, ay: lastAccel.y, az: lastAccel.z,
      gx: lastGyro.x,  gy: lastGyro.y,  gz: lastGyro.z,
      timestamp: Date.now(),
      magnitude,
      gMagnitude,
    });
  });
};

export const stopMotionListening = () => {
  accelSub?.remove();
  gyroSub?.remove();
  accelSub = null;
  gyroSub  = null;
};
