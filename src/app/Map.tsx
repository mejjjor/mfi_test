"use client";

import React, { useState, useRef, useEffect } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM.js";

import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction.js";

export default function MapWrapper() {
  const mapElement = useRef();

  const [map, setMap] = useState(null);
  const [featuresLayer, setFeaturesLayer] = useState(null);
  const [selectedCoord, setSelectedCoord] = useState(null);
  mapElement.current = map;

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
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

    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
  }, []);

  // get ref to div element - OpenLayers will render into this div

  // initialize map on first render - logic formerly put into componentDidMount
  return <div ref={mapElement} className="w-screen h-screen"></div>;
}
