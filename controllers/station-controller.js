import { stationStore } from "../models/station-store.js";
import { dashboardController } from "./dashboard-controller.js";
import { readingStore } from "../models/reading-store.js";
import { utilities } from "./utilities-controller.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationByID(request.params.id);
    for (let i = 0; i < station.readings.length - 1; i++) {
      station.readings[i].temperatureF = await utilities.celsiusToFahr(station.readings[i].temperature);
      station.readings[i].windSpeedBft = await utilities.kmhrToBeaufort(station.readings[i].windSpeed);
    }
    const viewData = {
      title: "Station",
      station: station,
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
    console.log(added);
    await stationStore.addReadingIDtoStation(station._id, added._id)
    response.redirect("/station/" + station._id);
  },
  async getReading(request, response) {
    console.log("rendering new report");
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=4c39e307d83d080c629fbf012b9b8bb8`
    const localeUrl = `https://us1.locationiq.com/v1/reverse.php?key=pk.694e2b488e7a8debadf8847f64a6684d&lat=${lat}&lon=${lng}&format=json`;
    const area = ((await axios.get(localeUrl)).data).display_name;
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.locale = area;
      report.code = reading.weather[0].id;
      report.temperatureC = reading.temp;
      report.temperatureF = celsiusToFahr(reading.temp);
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
    }
    console.log(report);
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    response.render("station-view", viewData);
  },
  async deleteReading(request, response){
    const station_id = request.params.station_id;
    const reading_id = request.params.id;
    console.log(`Deleting Reading ${reading_id} from the station ${station_id}`);
    await readingStore.deleteReading(reading_id);
    response.redirect("/station/" + station_id);
  }
}