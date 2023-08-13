import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { utilities } from "./utilities-controller.js";

export const dashboardController = {
  async index(request, response) {
    const stations = await stationStore.getAllStations()
    let readingid = stations.map(station => station.readings_id);
    const latest = readingid.map(id => id[readingid.length - 1]);
    const readings = await readingStore.getAllReadings();
    const latestReadings = []
    for (let j = 0; j < latest.length; j++){
      for (let i = 0; i < readings.length; i++) {
        if (readings[i]._id === latest[j]) {
          latestReadings.push(readings[i]);
        }
      }
    }
    const viewData = {
      title: "Weather Application",
      stations: stations,
      latest: latestReadings,
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  async addStation(request, response) {
    const newStation = {
      name: request.body.name,
    };
    console.log(`adding Station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
  async deleteStation(request, response) {
    stationStore.deleteStationByID(request.params.id);
    readingStore.deleteReadingbyStationID(request.params.id);
    response.redirect("/dashboard");
  }
};

