import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "./reading-store.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    station._id = v4();
    await readingStore.addReading(station._id, {
      "code": 0,
      "temperature": 0,
      "windSpeed": 0,
      "pressure": 0,
      "windDirection": 0
    },)
    const readings = await readingStore.getReadingsByStationID(station._id);
    const latest = readings[readings.length - 1];
    const latest_id = latest._id;
    station.readings_id.push(latest_id);
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationByID(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.readings = await readingStore.getReadingsByStationID(list._id);
    return list;
  },

  async deleteStationByID(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
};
