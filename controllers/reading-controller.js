import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";

export const readingController = {
    async index(request, response) {
        const stationid = request.params.station_id;
        const readingid = request.params.id;
        console.log(`Editing Reading ${readingid} from station ${stationid}`);
        const viewData = {
            title: "Edit Reading",
            station: await stationStore.getStationByID(stationid),
            reading: await readingStore.getReadingByID(readingid),
        };
        response.render("reading-view", viewData);
  },

    async update(request, response) {
        const stationid = request.params.station_id;
        const readingid = request.params.id;
        const updatedReading = {
            code: parseInt(request.body.code),
            temperature: parseFloat(request.body.temperature),
            windSpeed: parseFloat(request.body.windSpeed),
            windDirection: parseFloat(request.body.windDirection),
            pressure: parseInt(request.body.pressure),
        };
        console.log(`Updating Reading ${readingid} from Station ${stationid}`);
        //const reading = await readingStore.getReadingByID(readingid);
        await readingStore.updateReading(readingid, updatedReading);
        response.redirect("/station/" + stationid);
  },
};
