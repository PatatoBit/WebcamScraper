import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { setTimeout } from "node:timers/promises";

import puppeteer, { ElementHandle, Page } from "puppeteer";
import { fetchAQIData, getFormattedDateTime } from "./utils.js";
import { LiveCam } from "./index.js";

// Polyfill __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to capture screenshots
export async function captureScreenshots(urls: LiveCam[]) {
  const browser = await puppeteer.launch({
    headless: true, // Set to false to observe in real-time
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page: Page = await browser.newPage();

  try {
    for (const webcam of urls) {
      console.log(`Capturing: ${webcam.name} (${webcam.url})`);

      // Navigate to the webcam URL
      await page.goto(webcam.url, { waitUntil: "networkidle2" });

      // Start video playback if necessary
      await page.evaluate(() => {
        const video: HTMLVideoElement | null = document.querySelector("video");
        if (video) {
          video.muted = true;
          video.play().catch(() => console.error("Video failed to play"));
        }
      });

      // Wait a bit for the video to load
      await setTimeout(5000);

      // Prepare folder and filename
      const { date, time } = getFormattedDateTime();
      const aqi = await fetchAQIData(webcam.lat, webcam.lng);

      const outputDir = path.join(
        __dirname,
        "..",
        "screenshots",
        date,
        webcam.name
      );
      fs.mkdirSync(outputDir, { recursive: true });

      const filePath = path.join(outputDir, `AQI${aqi}_${time}.png`);

      // Take the screenshot
      // Locate the video element
      const videoElement: ElementHandle | null = await page.$("video");
      if (!videoElement) throw new Error("Video element not found.");

      // Capture the video element screenshot
      await videoElement.screenshot({
        path: filePath,
      });

      console.log(`Screenshot saved: ${filePath}`);
    }
  } catch (error) {
    console.error("Error capturing screenshots:", error);
  } finally {
    await browser.close();
  }

  await browser.close();
}
