"use client";

import { Autocomplete, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import Map from "./Map";
import ky from "ky";
import { Loader } from "@mantine/core";

import { useDebouncedValue } from "@mantine/hooks";
import Image from "next/image";

export default function Page() {
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [debouncedValue] = useDebouncedValue(autocompleteValue, 300);
  const [loading, setLoading] = useState(false);
  const [isValueSelected, setIsValueSelected] = useState(false);

  const handleSubmit = (val) => {
    console.log("dddddd", val);
    setIsValueSelected(true);
  };

  const fetchSuggestion = async () => {
    return (await ky(
      `${process.env.NEXT_PUBLIC_NOMINATIM_OSM_URL}/search?city=${debouncedValue}&format=json&addressdetails=1&limit=16`
    ).json()) as Array<any>;
  };

  useEffect(() => {
    if (isValueSelected || debouncedValue === "") {
      setIsValueSelected(false);
      setSuggestions([]);
      return;
    }
    setLoading(true);
    fetchSuggestion().then((results) => {
      const newSuggestions = results
        .map((item) => {
          return {
            value: `${
              item.address.city ||
              item.address.city_district ||
              item.address.village ||
              item.address.town ||
              item.address.country
            } (${item.address.country})`,
            // value: `${item.osm_id}/${item.lat}/${item.lon}`,
            lat: item.lat,
            lon: item.lon,
          };
        })
        .reduce((acc, item) => {
          if (!acc.hasOwnProperty(item.value)) {
            acc[item.value] = item;
          }
          return acc;
        }, {});

      console.log("sugg", newSuggestions);

      setSuggestions(Object.values(newSuggestions));
      setLoading(false);
    });
  }, [debouncedValue]);

  return (
    <div className="relative">
      <div className="fixed top-2 left-2 z-10 bg-white rounded p-2 w-[250px]">
        <Autocomplete
          label="Ville"
          rightSection={loading ? <Loader size={16} /> : null}
          placeholder="Paris"
          onChange={setAutocompleteValue}
          value={autocompleteValue}
          onItemSubmit={handleSubmit}
          data={suggestions}
        />
        <h3>Prévision méteo</h3>
        <div>
          {[12, 13, 15].map((forecast, index) => (
            <div key={index} className="flex items-center text-lg gap-2">
              <div>j+{index + 1} :</div>
              <div>{forecast} °C</div>
              <Image
                alt="forecast icon"
                src={"http://openweathermap.org/img/wn/10d@4x.png"}
                width="50"
                height="50"
              />
            </div>
          ))}
        </div>
      </div>
      <Map />;
    </div>
  );
}
