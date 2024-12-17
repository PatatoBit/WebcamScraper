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
  const response = await fetch(
    `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${process.env.AQI_API_KEY}`
  );
  const data = await response.json();

  if (!data || !data.data) {
    throw new Error("Failed to fetch AQI data");
  }

  return await data.data.aqi;
}
