import { captureEarthcams } from "./earthCam.js";
import { captureSkylineWebcams } from "./skylineWebcams.js";
import { formatWebcamData, getCountryCams, getWebcamData } from "./windyCam.js";

export interface LiveCam {
  name: string;
  url: string;
  lat: number;
  lng: number;
}

const EarthCamURLs: LiveCam[] = [
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
  {
    name: "Qingdao, China",
    url: "https://www.skylinewebcams.com/en/webcam/china/shandong/qingdao/qingdao.html",
    lat: 36.086179614408685,
    lng: 120.45848822854049,
  },
  {
    name: "Lamai, Koh Samui, Thailand",
    url: "https://www.skylinewebcams.com/en/webcam/thailand/surat-thani/ko-samui/lamai.html",
    lat: 9.45751428315116,
    lng: 100.03869361108009,
  },
  {
    name: "Etna Volcano, Sicily, Italy",
    url: "https://www.skylinewebcams.com/en/webcam/italia/sicilia/catania/vulcano-etna-sud.html",
    lat: 37.750922933402066,
    lng: 14.993458514277867,
  },

  {
    name: "El nido, Palawan, Philippines",
    url: "https://www.skylinewebcams.com/en/webcam/philippines/mimaropa/palawan/el-nido.html",
    lat: 11.181150970673162,
    lng: 119.39032911875917,
  },
];

export const outdoorCamsURLs: LiveCam[] = [
  {
    url: "https://www.outdooractive.com/en/webcam/chennai-tamil-nadu-north-north-west/803016623/",
    name: "Chennai, Tamil Nadu, India",
    lat: 13.12524,
    lng: 80.16037,
  },
  {
    url: "https://www.outdooractive.com/en/webcam/mumbai/803767402/",
    name: "Mumbai, Maharashtra, India",
    lat: 19.01441,
    lng: 72.84794,
  },
  {
    url: "https://www.outdooractive.com/en/webcam/madiyur-north-east-chennai-tamil-nadu/803959592/",
    name: "Madiyur, Chennai, Tamil Nadu, India",
    lat: 13.28616,
    lng: 80.24218,
  },
];

// await getCountryCams("IN").then((cams) => {
//   console.log(cams);
// });

await getWebcamData(1245318606).then((data) => {
  console.log(formatWebcamData(data));
});

// await captureEarthcams(EarthCamURLs);
// await captureSkylineWebcams(SkylineWebcamsURLs);
