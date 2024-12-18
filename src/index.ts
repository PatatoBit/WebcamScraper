import { captureEarthcams } from "./earthCam.js";
import { captureSkylineWebcams } from "./skylineWebcams.js";

export interface LiveCam {
  name: string;
  url: string;
  lat: number;
  lng: number;
}

export const EarthCamURLs: LiveCam[] = [
  {
    name: "Dallas, Texas",
    url: "https://www.earthcam.com/usa/texas/dallas/reuniontower/?cam=reuniontower",
    lat: 32.784843,
    lng: -96.798014,
  },
  {
    name: "Bourbon Street - New Orleans, Louisiana",
    url: "https://www.earthcam.com/usa/louisiana/neworleans/bourbonstreet/?cam=bourbonstreet",
    lat: 29.954683,
    lng: -90.069125,
  },
  {
    name: "Copacabana South - Rio de Janeiro, Brazil",
    url: "https://www.earthcam.com/world/brazil/riodejaneiro/?cam=rio_copacabana",
    lat: -22.98635,
    lng: -43.193337,
  },
  {
    name: "World Trade Center, New York City, New York",
    url: "https://www.earthcam.com/usa/newyork/worldtradecenter/?cam=skyline_g",
    lat: 40.714533,
    lng: -74.033226,
  },
  {
    name: "CN Tower - Toronto, Canada",
    url: "https://www.earthcam.com/world/canada/toronto/cntower/?cam=cntower2",
    lat: 43.64262746794477,
    lng: -79.38724827397026,
  },
];

const SkylineWebcamsURLs: LiveCam[] = [
  {
    name: "Shanghai Tower, Shanghai",
    url: "https://www.skylinewebcams.com/en/webcam/china/shanghai/shanghai/skyline-of-shanghai.html",
    lat: 31.233710649810327,
    lng: 121.50556972023557,
  },
];

await captureEarthcams(EarthCamURLs);
await captureSkylineWebcams(SkylineWebcamsURLs);
