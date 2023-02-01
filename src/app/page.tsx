"use client";

import { Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
import Map from "./Map";
import ky from "ky";
import { Loader } from "@mantine/core";
import { Accordion } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import Image from "next/image";
import dayjs from "dayjs";

export default function Page() {
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [debouncedValue] = useDebouncedValue(autocompleteValue, 300);
  const [loading, setLoading] = useState(false);
  const [loadingForcast, setLoadingForecast] = useState(false);
  const [isValueSelected, setIsValueSelected] = useState(false);

  const [forecast, setForecast] = useState([]);

  const handleSubmit = (val) => {
    setIsValueSelected(true);
    fetchForecast({ lat: val.lat, lon: val.lon });
  };

  const fetchSuggestion = async () => {
    return (await ky(
      `${process.env.NEXT_PUBLIC_NOMINATIM_OSM_URL}/search?q=${debouncedValue}&format=json&addressdetails=1&limit=16`
    ).json()) as Array<any>;
  };

  const fetchForecast = async ({ lon, lat, label = "" }) => {
    setLoadingForecast(true);
    if (label) {
      setIsValueSelected(true);
      setAutocompleteValue(label);
    }
    const results = (await ky(
      `${process.env.NEXT_PUBLIC_OPENWEATHER_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_APIKEY}&units=metric`
    ).json()) as any;

    setForecast(
      results.daily.slice(0, 3).map((forecast) => ({
        temp: forecast.temp.day.toFixed(1),
        weather: {
          label: forecast.weather[0].main,
          icon: forecast.weather[0].icon,
        },
      }))
    );
    setLoadingForecast(false);
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

      setSuggestions(Object.values(newSuggestions));
      setLoading(false);
    });
  }, [debouncedValue]);

  return (
    <div className="relative">
      <div className="fixed top-2 left-2 z-10 bg-white rounded p-2 min-w-[250px]">
        <Accordion defaultValue="content">
          <Accordion.Item className="border-none" value="content">
            <Accordion.Control>
              <h4 className="m-1">MFI TEST / Erik A.</h4>
              <Autocomplete
                onClick={(e) => e.stopPropagation()}
                label="Ville"
                rightSection={loading ? <Loader size={16} /> : null}
                placeholder="Paris"
                onChange={setAutocompleteValue}
                value={autocompleteValue}
                onItemSubmit={handleSubmit}
                data={suggestions}
              />
            </Accordion.Control>
            <Accordion.Panel>
              <h3 className="mb-0">Prévisions méteo</h3>
              <div className="flex justify-center">
                {loadingForcast && <Loader />}
              </div>
              {!loadingForcast && (
                <div className="inline-block justify-center bg-stone-500">
                  {forecast.map((forecast, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-lg bg-white mb-[1px] last:mb-0 px-2 gap-[1px]"
                    >
                      <div>
                        j+{index + 1} (
                        {dayjs()
                          .add(index + 1, "day")
                          .format("DD/MM")}
                        ) :{" "}
                        <span className="font-bold">{forecast.temp} °C</span>
                      </div>
                      <Image
                        alt={forecast.weather.label}
                        src={`http://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`}
                        width="50"
                        height="50"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
      <Map fetchForcast={fetchForecast} />;
    </div>
  );
}
