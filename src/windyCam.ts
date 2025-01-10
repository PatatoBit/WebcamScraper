import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();
const windyApiKey = process.env.WINDY_API_KEY;
const requestOptions = {
  headers: {
    "x-windy-api-key": windyApiKey,
  },
};

export async function getCountryCams(countryCode: string, limit = 10) {
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

export async function getWebcamData(webcamId: number) {
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

export function formatWebcamData(webcamData: any): WindyData {
  return {
    imageUrl: webcamData.images.current.preview,
    name: webcamData.title,
    lat: webcamData.location.latitude,
    lng: webcamData.location.longitude,
  };
}
