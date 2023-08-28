import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import gmaps from "@googlemaps/js-api-loader";

export const utilities = {
  async celsiusToFahr(temp) {
    const fahr = (temp * 9 / 5) + 32;
    return fahr;
  },
  async getLatestReadings(stations) {
    const latest = stations.map(latestid => latestid.readings_id[latestid.readings_id.length - 1]);
    const readings = await readingStore.getAllReadings();
    const latestReadings = []
    for (let j = 0; j < latest.length; j++) {
      for (let i = 0; i < readings.length; i++) {
        if (readings[i]._id === latest[j]) {
          latestReadings.push(readings[i]);
        }
      }
    }
    return latestReadings;
  },
  async predictWeather(code) {
    let weather;
    switch (code) {
      case 100:
        weather = "Clear";
        break
      case 200:
        weather = "Partial Clouds";
        break
      case 300:
        weather = "Cloudy";
        break
      case 400:
        weather = "Light Showers";
        break
      case 500:
        weather = "Heavy Showers";
        break
      case 600:
        weather = "Rain";
        break
      case 700:
        weather = "Snow";
        break
      case 800:
        weather = "Thunder";
        break
    }
    return weather;
  },
  async windChillCalculator(temp, windSpeed) {
    return Math.round((13.12 + (0.6215 * temp) - (11.37 * (windSpeed * 0.16)) + ((0.3965 * temp) * (windSpeed * 0.16))) * 100) / 100
  },
  async getMinTemp(temps) {
    let min = temps[0];
    for (let i = 1; i < temps.length; i++) {
      if (temps[i] < min) {
        min = temps[i]
      }
    }
    return min;
  },
  async getMaxTemp(temps) {
    let max = temps[0];
    for (let i = 1; i < temps.length; i++) {
      if (temps[i] > max) {
        max = temps[i]
      }
    }
    return max;
  },
  async getMinWindSpeed(windSpeeds) {
    let min = windSpeeds[0];
    for (let i = 1; i < windSpeeds.length; i++) {
      if (windSpeeds[i] < min) {
        min = windSpeeds[i]
      }
    }
    return min;
  },
  async getMaxWindSpeed(windSpeeds) {
    let max = windSpeeds[0];
    for (let i = 1; i < windSpeeds.length; i++) {
      if (windSpeeds[i] > max) {
        max = windSpeeds[i]
      }
    }
    return max;
  },
  async getMinPressure(pressures) {
    let min = pressures[0];
    for (let i = 1; i < pressures.length; i++) {
      if (pressures[i] < min) {
        min = pressures[i]
      }
    }
    return min;
  },
  async getMaxPressure(pressures) {
    let max = pressures[0];
    for (let i = 1; i < pressures.length; i++) {
      if (pressures[i] > max) {
        max = pressures[i]
      }
    }
    return max;
  },
  async kmhrToBeaufort(kmhrSpeed) {
    let bft;
    if (kmhrSpeed < 1.0) {
      bft = 0;
    } else if (kmhrSpeed >= 1.0 && kmhrSpeed <= 5.0) {
      bft = 1;
    } else if (kmhrSpeed > 5.0 && kmhrSpeed <= 11.0) {
      bft = 2;
    } else if (kmhrSpeed > 11.0 && kmhrSpeed <= 19.0) {
      bft = 3;
    } else if (kmhrSpeed > 19.0 && kmhrSpeed <= 28.0) {
      bft = 4;
    } else if (kmhrSpeed > 28.0 && kmhrSpeed <= 38.0) {
      bft = 5;
    } else if (kmhrSpeed > 38.0 && kmhrSpeed <= 49.0) {
      bft = 6;
    } else if (kmhrSpeed > 49.0 && kmhrSpeed < 62.0) {
      bft = 7;
    } else if (kmhrSpeed >= 62.0) {
      bft = 8;
    }
    return bft;
  },
  async trendTemp(temps) {
    if (temps.length < 1) {
      return 0;
    }
    else {
      const lastReading = temps[temps.length - 1];
      const scndLastReading = temps[temps.length - 2];
      const thrdLastReading = temps[temps.length - 3];
      if (lastReading > scndLastReading & scndLastReading > thrdLastReading) {
        return 1;
      } else if (lastReading == scndLastReading & scndLastReading == thrdLastReading) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  async trendWind(windSpeeds) {
    if (windSpeeds.length < 1) {
      return 0;
    }
    else {
      const lastReading = windSpeeds[windSpeeds.length - 1];
      const scndLastReading = windSpeeds[windSpeeds.length - 2];
      const thrdLastReading = windSpeeds[windSpeeds.length - 3];
      if (lastReading > scndLastReading & scndLastReading > thrdLastReading) {
        return 1;
      } else if (lastReading < scndLastReading & scndLastReading < thrdLastReading) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  async trendPressure(pressures) {
    if (pressures.length < 1) {
      return 0;
    }
    else {
      const lastReading = pressures[pressures.length - 1];
      const scndLastReading = pressures[pressures.length - 2];
      const thrdLastReading = pressures[pressures.length - 3];
      if (lastReading > scndLastReading & scndLastReading > thrdLastReading) {
        return 1;
      } else if (lastReading < scndLastReading & scndLastReading < thrdLastReading) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  async sortStations(stations) {
    const sortedStations = stations.sort((stationX, stationY) => stationX.name.localeCompare(stationY.name));
    return sortedStations;
  },
  async formatDateTime(dateTime) {
    let dateTimeObj = new Date(dateTime);
    let formatter = {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
    let formattedTime = dateTimeObj.toLocaleString("en-GB", formatter);
    return formattedTime;
  },

  async getWindDirectionNESW(degrees) {
    let direction;
    if (degrees >= 337.5 || degrees < 22.5) {
      direction = "N";
    }
    else if (degrees >= 22.5 && degrees < 67.5) {
      direction = "NE";
    }
    else if (degrees >= 67.5 && degrees < 112.5) {
      direction = "E";
    }
    else if (degrees >= 112.5 && degrees < 157.5) {
      direction = "SE";
    }
    else if (degrees >= 157.5 && degrees < 202.5) {
      direction = "S";
    }
    else if (degrees >= 202.5 && degrees < 247.5) {
      direction = "SW";
    }
    else if (degrees >= 247.5 && degrees < 292.5) {
      direction = "W";
    }
    else if (degrees >= 292.5 && degrees < 337.5) {
      direction = "NW";
    }
    else {
      direction = "Invalid"
    }
    return direction;
  },
  async initMap(lat, lng) {
    const { Loader } = gmaps;
    const loader = new gmaps.Loader({
      apiKey: "AIzaSyBSvR_TSJKwKLD1azC32vi-0noNtBzKmd4",
      version: "weekly"
    });
    let map;
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
      center: { lat: lat, lng: lng },
      zoom: 10,
    });
  }
}