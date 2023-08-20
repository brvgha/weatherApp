import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { stationStore } from "./station-store.js";

const db = initStore("readings")

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },
  async addReading(stationID, newReading) {
    await db.read();
    newReading._id = v4();
    newReading.station_id = stationID;
    db.data.readings.push(newReading);
    await db.write();
    return newReading;
  },

  async getReadingsByStationID(id) {
    await db.read();
    return db.data.readings.filter((reading) => reading.station_id === id);
  },

  async getReadingByID(id) {
    await db.read();
    return db.data.readings.find((reading) => reading._id === id);
  },

  async deleteReading(id) {
    await db.read();
    const index = db.data.readings.findIndex((reading) => reading._id === id);
    db.data.readings.splice(index, 1);
    await db.write();
  },

  async deleteAllReadings() {
    db.data.readings = [];
    await db.write();
  },

  async updateReading(reading, updatedreading) {
    reading.title = updatedreading.title;
    reading.artist = updatedreading.artist;
    reading.duration = updatedreading.duration;
    await db.write();
  },
}