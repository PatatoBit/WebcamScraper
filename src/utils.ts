import { configDotenv } from "dotenv";

// Helper to format current date and time
export const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return { date, time };
};

configDotenv();

export async function fetchAQIData(lat: number, lng: number) {
  try {
    const apiKey = process.env.AQI_API_KEY;

    if (!apiKey) {
      throw new Error("AQI_API_KEY is missing in the environment variables.");
    }

    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch AQI data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data || !data.data || data.data.aqi === undefined) {
      throw new Error("Invalid AQI response data.");
    }

    return data.data.aqi;
  } catch (error) {
    console.error("Error fetching AQI data:", error.message);
    return null; // or handle it as needed, e.g., throw error
  }
}

export async function getLocalTimeAndDayOrNight(
  lat: number,
  lng: number,
  username: string
): Promise<{ localTime: string; isDay: boolean }> {
  const url = `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${username}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.time || !data.sunrise || !data.sunset) {
    throw new Error(
      "Failed to retrieve local time or sunrise/sunset data from GeoNames API"
    );
  }

  // Parse the local time, sunrise, and sunset
  const localTime = new Date(data.time);
  const sunrise = new Date(data.sunrise);
  const sunset = new Date(data.sunset);

  const currentTime = data.time.split(" ")[1].replace(":", "-");

  // Determine if it's day or night
  const isDay = localTime >= sunrise && localTime < sunset;

  return { localTime: currentTime, isDay };
}

export async function getWeatherCondition(
  lat: number,
  lng: number
): Promise<string> {
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.weather || data.weather.length === 0) {
    throw new Error("Failed to retrieve weather data");
  }

  // Extract the weather description
  const condition = data.weather[0].main; // e.g., "hazy", "cloudy", "foggy"
  return condition;
}
