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
  }
}