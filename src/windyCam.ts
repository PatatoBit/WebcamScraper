import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

export async function getCountryCams(countryCode: string) {
  const windyApiKey = process.env.WINDY_API_KEY;

  const requestOptions = {
    headers: {
      "x-windy-api-key": windyApiKey,
    },
  };

  if (!windyApiKey) {
    throw new Error("Windy API key not found");
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&countries=${countryCode}`;

  try {
    const response = await axios.get(url, requestOptions);
    return response.data.webcams;
  } catch (error) {
    console.error("Error fetching country cams:", error.message);
    return [];
  }
}
