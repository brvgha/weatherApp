import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("readings")

export const readingStore = {
  async getAllReadings() {
        await db.read();
        return db.data.readings;
    },
  async addReading(stationID, reading) {
    await db.read();
    reading._id = v4();
    reading.stationid = stationID;
    db.data.readings.push(reading);
    await db.write();
    return reading;
  },

  async getReadingsByStationID(id) {
    await db.read();
    return db.data.readings.filter((reading) => reading.station_id === id);
  },

  async getReadingByID(id) {
    await db.read();
    return db.data.readings.find((reading) => reading.id === id);
  },
  async deleteReadingbyStationID(station_id) {
    await db.read();
    const index = db.data.readings.findIndex((station) => station.id === station_id);
    db.data.readings.splice(index);
    await db.write()
  },

  async deleteReading(id) {
    await db.read();
    const index = db.data.readings.findIndex((reading) => reading.id === id);
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