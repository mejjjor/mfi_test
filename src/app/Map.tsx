"use client";

import React, { useRef, useEffect } from "react";

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

function createStyle(src) {
  return new Style({
    image: new Icon({
      crossOrigin: "anonymous",
      src,
    }),
  });
}

export default function MapWrapper({ fetchForcast }) {
  const mapElement = useRef();

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

  useEffect(() => {
    const initialVertorLayer = new VectorSource({
      features: [mfiToulouse, mfSaintMande, wmoGeneve],
    });
    const initalFeaturesLayer = new VectorLayer({
      source: initialVertorLayer,
    });

    const initialMap = new Map({
      target: mapElement.current,
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

      layers: [
        new TileLayer({
          source: new OSM(),
        }),

        initalFeaturesLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      controls: [],
    });

    initialMap.on("click", function (evt) {
      const feature = initialMap.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        }
      );
      if (!feature) {
        return;
      }
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

    initialMap.addInteraction(select);

    initialMap.on("pointermove", function (evt) {
      const pixel = initialMap.getEventPixel(evt.originalEvent);
      const hit = initialMap.hasFeatureAtPixel(pixel);

      (initialMap.getTarget() as HTMLElement).style.cursor = hit
        ? "pointer"
        : "";
    });
  }, []);

  return <div ref={mapElement} className="w-screen h-screen"></div>;
}
