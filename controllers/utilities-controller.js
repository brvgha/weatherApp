import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
export const utilities = {
  async celsiusToFahr(temp) {
  const fahr = (temp * 9 / 5) + 32;
  return fahr;
  },
  async getLatest() {
    const stations = await stationStore.getAllStations();
    const readingid = stations.map(station => station.readings_id);
    const latest = readingid.map(id => id[id.length - 1]);
    const readings = await readingStore.getAllReadings();
    const latestReadings = []
    for (let j = 0; j < latest.length; j++){
      for (let i = 0; i < readings.length; i++) {
        if (readings[i].id === latest[j]) {
          latestReadings.push(readings[i]);
        }
      }
    }
    console.log(latestReading);
    return latestReading;
  },
}
