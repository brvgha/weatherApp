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
    
    // check to see if the Readings are empyty first, and if not check if the the first reading is null
    // from adding a station, thus replacing the first null reading with the true first reading
    const stationReadings = db.data.readings.filter((reading) => reading.station_id === stationID);
    /*if (stationReadings.length != 0) {
      if (stationReadings[0].code === null) {
        stationReadings[0].code = newReading.code;
        stationReadings[0].temperature = newReading.temperature; 
        stationReadings[0].windSpeed = newReading.windSpeed; 
        stationReadings[0].windDirection = newReading.windDirection;
        stationReadings[0].pressure = newReading.pressure; 
    }
    }else {
      db.data.readings.push(newReading);
    }*/
    db.data.readings.push(newReading);
    console.log(db.data.readings);
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

  async updateReading(readingid, updatedReading) {
    const reading = await this.getReadingByID(readingid);
    reading.time = new Date();
    reading.code = updatedReading.code;
    reading.temperature = updatedReading.temperature;
    reading.windSpeed = updatedReading.windSpeed;
    reading.windDirection = updatedReading.windDirection;
    reading.pressure = updatedReading.pressure;
    await db.write();
  },
}