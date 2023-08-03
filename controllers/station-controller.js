

export const stationController = {
    async addReport(code, temperatureC, windSpeed, pressure, windDirection) {
        let report = {};
        report.code = code;
        report.temperatureC = temperatureC;
        report.temperatureF = celsiusToFahr(temperatureC);
        report.windSpeed = windSpeed;
        report.pressure = pressure;
        report.windDirection = windDirection;
        console.log(report);
        const viewData = {
        title: "Weather Report",
        reading: report
        };
        response.render("dashboard-view", viewData);
    },
    async getReport(request, response) {
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
    response.render("dashboard-view", viewData);
  }
}