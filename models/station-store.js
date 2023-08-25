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
    const dateTime = new Date();
    await readingStore.addReading(station._id, {
      "time": dateTime,
      "code": null,
      "temperature": null,
      "windSpeed": null,
      "pressure": null,
      "windDirection": null
    },)
    const readings = await readingStore.getReadingsByStationID(station._id);
    const latest = readings[readings.length - 1];
    const latest_id = latest._id;
    station.readings_id.push(latest_id);
    db.data.stations.push(station);
    await db.write();
    return station;
  },
  async getStationsByUserID(id) {
    await db.read();
    return db.data.stations.filter((station) => station.user_id === id);
  },

  async getStationByID(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.readings = await readingStore.getReadingsByStationID(list._id);
    return list;
  },

  async addReadingIDtoStation(station_id, reading_id) {
    await db.read();
    const station = db.data.stations.find((station) => station._id === station_id);
    station.readings_id.push(reading_id);
    await db.write();
    return station;
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
  }
}
