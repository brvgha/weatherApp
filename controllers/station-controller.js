import { stationStore } from "../models/station-store.js";
import { dashboardController } from "./dashboard-controller.js";
import { readingStore } from "../models/reading-store.js";
import { utilities } from "./utilities-controller.js";
import Handlebars from "handlebars";
import axios from "axios";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationByID(request.params.id);
    const readings = await readingStore.getReadingsByStationID(station._id);
    const temps = readings.map(reading => reading.temperature);
    const windSpeeds = readings.map(reading => reading.windSpeed);
    const pressures = readings.map(reading => reading.pressure);
    const latestReading = readings[readings.length - 1];
    
    latestReading.name = station.name;
    latestReading.weather = await utilities.predictWeather(latestReading.code);
    latestReading.temperatureF = await utilities.celsiusToFahr(latestReading.temperature);
    latestReading.windSpeedBft = await utilities.kmhrToBeaufort(latestReading.windSpeed);
    latestReading.windDirectionNESW = await utilities.getWindDirectionNESW(latestReading.windDirection);
    latestReading.windChill = await utilities.windChillCalculator(latestReading.temperature, latestReading.windSpeed);
    latestReading.minTemp = await utilities.getMinTemp(temps);
    latestReading.maxTemp = await utilities.getMaxTemp(temps);
    latestReading.minWindSpeed = await utilities.getMinWindSpeed(windSpeeds);
    latestReading.maxWindSpeed = await utilities.getMaxWindSpeed(windSpeeds);
    latestReading.minPressure = await utilities.getMinPressure(pressures);
    latestReading.maxPressure = await utilities.getMaxPressure(pressures);
    latestReading.trendTemp = await utilities.trendTemp(temps);
    latestReading.trendWind = await utilities.trendWind(windSpeeds);
    latestReading.trendPressure = await utilities.trendPressure(pressures);
    latestReading.lat = station.lat;
    latestReading.lng = station.lng;


    for (let i = 0; i <= station.readings.length - 1; i++) {
      station.readings[i].temperatureF = await utilities.celsiusToFahr(station.readings[i].temperature);
      station.readings[i].windSpeedBft = await utilities.kmhrToBeaufort(station.readings[i].windSpeed);
      station.readings[i].formattedTime = await utilities.formatDateTime(station.readings[i].time);
    }
    const viewData = {
      title: "Station",
      station: station,
      latest: latestReading,
      trendChk: Handlebars.registerHelper("trendChk", function(a, b){
      return a === b;
      }),
      weatherIcon: Handlebars.registerHelper("weatherIcon", function (a, b) {
        let icon;
        switch (a) {
          case 100:
            icon = 1;
            break;
          case 200:
            icon = 2;
            break;
          case 300:
            icon = 3;
            break;
          case 400:
            icon = 4;
            break;
          case 500:
            icon = 5;
            break;
          case 600:
            icon = 6;
            break;
          case 700:
            icon = 7;
            break;
          case 800:
            icon = 8;
            break;
        }
        return icon === b;
      })
    }
    response.render("station-view", viewData);
  },
  async addReading(request, response) {
    const station = await stationStore.getStationByID(request.params.id);
    const newReading = {
      code: parseInt(request.body.code),
      temperature: parseFloat(request.body.temperature),
      temperatureF : await utilities.celsiusToFahr(request.body.temperature),
      windSpeed: parseFloat(request.body.windSpeed),
      windSpeedBft: await utilities.kmhrToBeaufort(request.body.windSpeed),
      windDirection : parseFloat(request.body.windDirection),
      pressure : parseInt(request.body.pressure),
    };
    console.log(`adding Reading ${newReading.code}`);
    const added = await readingStore.addReading(station._id, newReading);
    await stationStore.addReadingIDtoStation(station._id, added._id)
    response.redirect("/station/" + station._id);
  },
  async getReading(request, response) {
    const station = await stationStore.getStationByID(request.params.id);
    console.log(station._id)
    console.log("rendering new report");
    let report = {};
    const lat = station.lat;
    const lng = station.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=4c39e307d83d080c629fbf012b9b8bb8`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.time = new Date(reading.dt*1000);
      report.code = Math.round(reading.weather[0].id/100)*100;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
    }
    console.log(result.data.current);
    console.log(`adding Reading ${report.code}`);
    const added = await readingStore.addReading(station._id, report);
    await stationStore.addReadingIDtoStation(station._id, added._id)
    response.redirect("/station/" + station._id);
  },
  async deleteReading(request, response){
    const station_id = request.params.station_id;
    const reading_id = request.params.id;
    console.log(`Deleting Reading ${reading_id} from the station ${station_id}`);
    await readingStore.deleteReading(reading_id);
    response.redirect("/station/" + station_id);
  }
}