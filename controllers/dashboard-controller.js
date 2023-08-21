import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { utilities } from "./utilities-controller.js";
import { accountsController } from "./accounts-controller.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stations = await stationStore.getStationsByUserID(loggedInUser._id);
    const station_names = stations.map(stations => stations.name);
    const station_lat = stations.map(stations => stations.lat);
    const station_lng = stations.map(stations => stations.lng);
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

    let stationWind = {};

    readings.forEach(reading => {
      let stationId = reading.station_id;
      let windSpeed = reading.windSpeed;
      
      if (!stationWind[stationId]) {
          stationWind[stationId] = [];
      }
      
      stationWind[stationId].push(windSpeed);
    });
    let stationPressure = {};

    readings.forEach(reading => {
      let stationId = reading.station_id;
      let pressure = reading.pressure;
      
      if (!stationPressure[stationId]) {
          stationPressure[stationId] = [];
      }
      
      stationPressure[stationId].push(pressure);
    });

    let temps = Object.values(stationTemperatures);
    let winds = Object.values(stationWind);
    let pressures = Object.values(stationPressure);
    for (let x = 0; x < latestReadings.length; x++){
      latestReadings[x].name = station_names[x];
      latestReadings[x].lat = station_lat[x];
      latestReadings[x].lng = station_lng[x];
      latestReadings[x].temperatureF = await utilities.celsiusToFahr(latestReadings[x].temperature);
      latestReadings[x].windSpeedBft = await utilities.kmhrToBeaufort(latestReadings[x].windSpeed);
      latestReadings[x].weather = await utilities.predictWeather(latestReadings[x].code);
      latestReadings[x].windChill = await utilities.windChillCalculator(latestReadings[x].temperature, latestReadings[x].windSpeed);
      latestReadings[x].minTemp = await utilities.getMinTemp(temps[x]);
      latestReadings[x].maxTemp = await utilities.getMaxTemp(temps[x]);
      latestReadings[x].minWindSpeed = await utilities.getMinWindSpeed(winds[x]);
      latestReadings[x].maxWindSpeed = await utilities.getMaxWindSpeed(winds[x]);
      latestReadings[x].minPressure = await utilities.getMinPressure(pressures[x]);
      latestReadings[x].maxPressure = await utilities.getMaxPressure(pressures[x]);
      latestReadings[x].trendTemp = await utilities.trendTemp(temps[x]);
      latestReadings[x].trendWind = await utilities.trendWind(winds[x]);
      latestReadings[x].trendPressure = await utilities.trendPressure(pressures[x]);
    }
    
    const viewData = {
      title: "Weather Application",
      latest: latestReadings,
      stations: stations
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      readings_id: [],
      lat: parseFloat(request.body.lat),
      lng: parseFloat(request.body.lng),
      user_id: loggedInUser._id,
    };
    console.log(`adding Station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
  async deleteStation(request, response) {
    const station_id = request.params.id;
    console.log(`Deleting Station ${station_id}`);
    await stationStore.deleteStationByID(station_id);
    response.redirect("/dashboard");
  }
};


