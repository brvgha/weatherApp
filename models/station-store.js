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
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationByID(id) {
    await db.read();
    const list = db.data.stations.find((station) => station.id === id);
    list.readings = await readingStore.getReadingsByStationID(list.id);
    return list;
  },

  async deleteStationByID(id) {
    await db.read();
    const index = db.data.station.findIndex((station) => station.id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
};
