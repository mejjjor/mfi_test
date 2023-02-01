"use client";

import React, { useRef, useEffect } from "react";

import { init } from "~/ol";

export default function MapWrapper({ fetchForcast }) {
  const mapElement = useRef();

  useEffect(() => {
    init({ target: mapElement.current, fetchForcast });
  }, []);

  return <div ref={mapElement} className="w-screen h-screen"></div>;
}
