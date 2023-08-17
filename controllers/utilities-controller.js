import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
export const utilities = {
  async celsiusToFahr(temp) {
    const fahr = (temp * 9 / 5) + 32;
    return fahr;
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
    return Math.round((13.12 + (0.6215*temp) - (11.37*(windSpeed*0.16)) + ((0.3965*temp)*(windSpeed*0.16)))*100)/100
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
  async getMaxTemp(temps){
    let max = temps[0];
    for (let i = 1; i < temps.length; i++) {
      if (temps[i] > max) {
        max = temps[i]
      }
    }
    return max;
  },
  async kmhrToBeaufort(kmhrSpeed) {
    let bft;
    if (kmhrSpeed < 1) {
    bft = 0;
    } else if (kmhrSpeed > 1.0 && kmhrSpeed <= 5.0) {
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
    } else if (kmhrSpeed > 49.0 && kmhrSpeed <= 61.0) {
        bft = 7;
    } else if (kmhrSpeed > 62.0) {
    bft = 8;
    }
    return bft;
  }
}