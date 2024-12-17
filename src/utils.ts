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
