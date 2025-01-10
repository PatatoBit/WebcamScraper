import axios from "axios";
import { configDotenv } from "dotenv";
import path from "path";
import fs from "fs";
import {
  fetchAQIData,
  getFormattedDateTime,
  getLocalTimeAndDayOrNight,
  getWeatherCondition,
} from "./utils.js";

configDotenv();
const windyApiKey = process.env.WINDY_API_KEY;
const requestOptions = {
  headers: {
    "x-windy-api-key": windyApiKey,
  },
};

async function getCountryCams(countryCode: string, limit = 10) {
  if (!windyApiKey) {
    throw new Error("Windy API key not found");
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=${limit}&offset=0&countries=${countryCode}`;

  try {
    const response = await axios.get(url, requestOptions);
    return response.data.webcams;
  } catch (error) {
    console.error("Error fetching country cams:", error.message);
    return [];
  }
}

async function getWebcamData(webcamId: number) {
  if (!windyApiKey) {
    throw new Error("Windy API key not found");
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams/${webcamId}?include=images,location&lang=en`;

  try {
    const response = await axios.get(url, requestOptions);
    return response.data;
  } catch (error) {
    console.error("Error fetching webcam data:", error.message);
    return null;
  }
}

interface WindyData {
  imageUrl: string;
  name: string;
  lat: number;
  lng: number;
}

function formatWebcamData(webcamData: any): WindyData {
  return {
    imageUrl: webcamData.images.current.preview,
    name: webcamData.title,
    lat: webcamData.location.latitude,
    lng: webcamData.location.longitude,
  };
}

export async function captureWindyCams(countryCode: string, limit = 10) {
  const cams = await getCountryCams(countryCode, limit);
  const windyCams = cams.map(async (cam: any) => {
    const data = await getWebcamData(cam.id);
    return formatWebcamData(data.result.webcam);
  });

  const fetchedWindyCams = Promise.all(windyCams);

  const finalWindyData = await Promise.all(
    (
      await fetchedWindyCams
    ).map(async (cam: WindyData) => {
      const aqi = await fetchAQIData(cam.lat, cam.lng);
      const { localTime, isDay } = await getLocalTimeAndDayOrNight(
        cam.lat,
        cam.lng,
        "patato"
      );
      const weatherCondition = await getWeatherCondition(cam.lat, cam.lng);
      const dayOrNight = isDay ? "day" : "night";

      return {
        ...cam,
        aqi,
        localTime,
        weatherCondition,
        dayOrNight,
      };
    })
  );

  // Directory for storing screenshots
  const { date } = getFormattedDateTime();
  const outputDir = path.join(__dirname, "..", "screenshots", date);
  fs.mkdirSync(outputDir, { recursive: true });

  // Save images to disk
  for (const cam of finalWindyData) {
    try {
      const fileName = `${cam.localTime}_${cam.dayOrNight}_AQI${cam.aqi}_${cam.weatherCondition}_${cam.name}.jpg`;
      const filePath = path.join(outputDir, fileName);

      const response = await axios.get(cam.imageUrl, {
        responseType: "stream",
      });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(`Image saved: ${filePath}`);
    } catch (error) {
      console.error(`Failed to save image for ${cam.name}:`, error.message);
    }
  }

  console.log("All images captured successfully.");
}
