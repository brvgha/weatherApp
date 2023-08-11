import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { utilities } from "./utilities-controller.js";
const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=4c39e307d83d080c629fbf012b9b8bb8`
export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Weather Application",
      stations: await stationStore.getAllStations(),
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
