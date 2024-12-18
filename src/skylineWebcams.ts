import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { setTimeout } from "node:timers/promises";

import puppeteer, { ElementHandle, Page } from "puppeteer";
import {
  fetchAQIData,
  getFormattedDateTime,
  getLocalTimeAndDayOrNight,
  getWeatherCondition,
} from "./utils.js";
import { LiveCam } from "./index.js";

// Polyfill __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to capture screenshots from SkylineWebcams
export async function captureSkylineWebcams(urls: LiveCam[]) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const page: Page = await browser.newPage();

  try {
    for (const webcam of urls) {
      console.log("====================================");
      console.log(`Capturing: ${webcam.name} (${webcam.url})`);

      // Navigate to the webcam URL
      await page.goto(webcam.url, { waitUntil: "networkidle2" });

      // Ensure the video element starts playback
      await page.evaluate(() => {
        const video: HTMLVideoElement | null = document.querySelector("video");
        if (video) {
          video.muted = true;
        }
      });
      await page.click("video");

      const isPlaying = await page.evaluate(() => {
        const video = document.querySelector("video");
        return video && !video.paused && !video.ended && video.readyState > 2;
      });

      if (!isPlaying) {
        console.error("Video is not playing. Check CORS or network issues.");
      }

      // Wait for the video to stabilize
      await setTimeout(20 * 1000);

      // Fetch metadata (AQI, weather, etc.)
      const { date } = getFormattedDateTime();
      const aqi = await fetchAQIData(webcam.lat, webcam.lng);

      const { localTime, isDay } = await getLocalTimeAndDayOrNight(
        webcam.lat,
        webcam.lng,
        "patato"
      );

      const weatherCondition = await getWeatherCondition(
        webcam.lat,
        webcam.lng
      );

      const dayOrNight = isDay ? "day" : "night";

      // Prepare output directory and filename
      const outputDir = path.join(
        __dirname,
        "..",
        "screenshots",
        date,
        webcam.name
      );
      fs.mkdirSync(outputDir, { recursive: true });

      const filePath = path.join(
        outputDir,
        `AQI${aqi}_${dayOrNight}_${localTime}_${weatherCondition}.png`
      );

      console.log("AQI: ", aqi);
      console.log("Day or Night: ", dayOrNight);
      console.log("Local Time: ", localTime);
      console.log("Weather Condition: ", weatherCondition);

      // Take a screenshot of the video element
      const videoElement: ElementHandle | null = await page.$("video");
      if (!videoElement) throw new Error("Video element not found.");

      await videoElement.screenshot({
        path: filePath,
      });

      console.log(`Screenshot saved: ${filePath}`);
      console.log("====================================");
      console.log();
    }
  } catch (error) {
    console.error("Error capturing screenshots:", error);
  } finally {
    await browser.close();
  }
}
