import { captureScreenshots } from "./earthCam.js";

export interface LiveCam {
  name: string;
  url: string;
  lat: number;
  lng: number;
}

export const liveCamURLs: LiveCam[] = [
  {
    name: "Dallas, Texas",
    lat: 32.784843,
    lng: -96.798014,
    url: "https://www.earthcam.com/usa/texas/dallas/reuniontower/?cam=reuniontower",
  },
  {
    name: "Lockley Park - Plainfieldm, Illinois",
    lat: 41.612508,
    lng: -88.202189,
    url: "https://myearthcam.com/lockleypark",
  },
  {
    name: "Copacabana South - Rio de Janeiro, Brazil",
    lat: -22.98635,
    lng: -43.193337,
    url: "https://www.earthcam.com/world/brazil/riodejaneiro/?cam=rio_copacabana",
  },
];

await captureScreenshots(liveCamURLs);
