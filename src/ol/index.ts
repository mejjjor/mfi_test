import Feature from "ol/Feature.js";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM.js";
import { fromLonLat } from "ol/proj.js";
import Point from "ol/geom/Point.js";
import { Icon, Style } from "ol/style.js";
import { toLonLat } from "ol/proj";
import Select from "ol/interaction/Select.js";

import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction.js";

let vectorLayer: VectorSource<Point>;
let featuresLayer: VectorLayer<VectorSource<Point>>;
let map: Map;
let currentPoint;

function createStyle(src) {
  return new Style({
    image: new Icon({
      crossOrigin: "anonymous",
      src,
    }),
  });
}

function resetFeatures() {
  vectorLayer.clear();
  getPoints().forEach((point) => {
    vectorLayer.addFeature(point);
  });
}

function getPoints() {
  const mfiToulouse = new Feature({
    geometry: new Point(fromLonLat([1.3772919, 43.5787476])),
  });

  const mfSaintMande = new Feature({
    geometry: new Point(fromLonLat([2.4223775, 48.8456978])),
  });

  const wmoGeneve = new Feature({
    geometry: new Point(fromLonLat([6.1440339, 46.2233499])),
  });

  mfiToulouse.setStyle(createStyle("assets/map-pin-filled.svg"));
  mfSaintMande.setStyle(createStyle("assets/map-pin-filled.svg"));
  wmoGeneve.setStyle(createStyle("assets/map-pin-filled.svg"));

  mfiToulouse.set("label", "MFI Toulouse (France)");
  mfSaintMande.set("label", "MF Saint Mandé (France)");
  wmoGeneve.set("label", "WMO Genève (Suisse)");

  return [mfiToulouse, mfSaintMande, wmoGeneve];
}

export function addPoint({ lon, lat }) {
  if (currentPoint) {
    resetFeatures();
  }

  currentPoint = new Feature({
    geometry: new Point(fromLonLat([lon, lat])),
  });

  currentPoint.setStyle(createStyle("assets/map-pin-filled-selected.svg"));
  vectorLayer.addFeature(currentPoint);
  map.getView().setCenter(fromLonLat([lon, lat]));
  map.getView().setZoom(5);
}

export function init({ target, fetchForcast }) {
  vectorLayer = new VectorSource({
    features: getPoints(),
  });
  featuresLayer = new VectorLayer({
    source: vectorLayer,
  });

  map = new Map({
    target,
    interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

    layers: [
      new TileLayer({
        source: new OSM(),
      }),

      featuresLayer,
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
    controls: [],
  });

  const extent = vectorLayer.getExtent();
  map.getView().fit(extent, { padding: [250, 250, 250, 250] });

  map.on("click", function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    if (!feature) {
      return;
    }
    resetFeatures();
    var lonlat = toLonLat((feature.getGeometry() as Point).getCoordinates());
    var lon = lonlat[0];
    var lat = lonlat[1];

    fetchForcast({ lon, lat, label: feature.get("label") });
  });

  const select = new Select({
    style: function (feature: any) {
      feature.setStyle(createStyle("assets/map-pin-filled-selected.svg"));
    },
  });

  map.addInteraction(select);

  map.on("pointermove", function (evt) {
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);

    (map.getTarget() as HTMLElement).style.cursor = hit ? "pointer" : "";
  });
}
