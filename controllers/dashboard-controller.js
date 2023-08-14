import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { utilities } from "./utilities-controller.js";
export const dashboardController = {
  async index(request, response) {
    const stations = await stationStore.getAllStations()
    const station_names = stations.map(stations => stations.name)
    const readingid = stations.map(station => station.readings_id);
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
    for (let x = 0; x < latestReadings.length; x++){
      latestReadings[x].name = station_names[x];
      latestReadings[x].temperatureF = await utilities.celsiusToFahr(latestReadings[x].temperature);
      latestReadings[x].weather = await utilities.predictWeather(latestReadings[x].code);
    }
    console.log(latestReadings);
    const viewData = {
      title: "Weather Application",
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

