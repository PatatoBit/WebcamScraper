import { captureScreenshots } from "./earthCam.js";

export interface LiveCam {
  name: string;
  url: string;
}

const liveCamURLs: LiveCam[] = [
  {
    name: "Dallas, Texas",
    url: "https://www.earthcam.com/usa/texas/dallas/reuniontower/?cam=reuniontower",
  },
  {
    name: "Lockley Park - Plainfieldm, Illinois",
    url: "https://myearthcam.com/lockleypark",
  },
  {
    name: "Copacabana South - Rio de Janeiro, Brazil",
    url: "https://www.earthcam.com/world/brazil/riodejaneiro/?cam=rio_copacabana",
  },
];

captureScreenshots(liveCamURLs);
