import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { utilities } from "./utilities-controller.js";
const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=4c39e307d83d080c629fbf012b9b8bb8`
export const dashboardController = {
  async index(request, response) {
    const stations = await stationStore.getAllStations()
    const station_names = stations.map(stations => stations.name)
    const latest = stations.map(latestid => latestid.readings_id[latestid.readings_id.length - 1]);
    const readings = await readingStore.getAllReadings();
    const latestReadings = []
    for (let j = 0; j < latest.length; j++){
      for (let i = 0; i < readings.length; i++) {
        if (readings[i]._id === latest[j]) {
          latestReadings.push(readings[i]);
        }
      }
    }

    let stationTemperatures = {};

    readings.forEach(reading => {
      let stationId = reading.station_id;
      let temperature = reading.temperature;
      
      if (!stationTemperatures[stationId]) {
          stationTemperatures[stationId] = [];
      }
      
      stationTemperatures[stationId].push(temperature);
    });

    let temps = Object.values(stationTemperatures)
    for (let x = 0; x < latestReadings.length; x++){
      latestReadings[x].name = station_names[x];
      latestReadings[x].temperatureF = await utilities.celsiusToFahr(latestReadings[x].temperature);
      latestReadings[x].weather = await utilities.predictWeather(latestReadings[x].code);
      latestReadings[x].windChill = await utilities.windChillCalculator(latestReadings[x].temperature, latestReadings[x].windSpeed);
      latestReadings[x].minTemp = await utilities.getMinTemp(temps[x]);
      latestReadings[x].maxTemp = await utilities.getMaxTemp(temps[x]);
    }

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
      readings_id: [],
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


