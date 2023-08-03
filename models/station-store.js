import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "./reading-store.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    /*let stations = [];
    for (let i = 0; i < db.data.stationCollection.length; i++) {
      stations.push(db.data.stationCollection[i].name);
    }
    console.log(stations);*/
    return db.data.stationCollection;
  },

  async addStation(stationID, name) {
    await db.read();
    name._id = v4();
    name.stationID = stationID;
    db.data.stations.push(name);
    await db.write();
    return name;
  },

  async getStationByID(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.readings = await readingStore.getReadingsByStationId(list._id);
    return list;
  },

  async deleteStationByID(id) {
    await db.read();
    const index = db.data.station.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
};
