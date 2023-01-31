"use client";

import { Autocomplete, TextInput } from "@mantine/core";
import Map from "./Map";

export default function Page() {
  return (
    <div className="relative">
      <div className="fixed top-2 left-2 z-10 bg-white rounded p-2">
        <Autocomplete
          label="Ville"
          placeholder="Paris"
          data={["Paris", "Toulouse"]}
        />
      </div>
      <Map />;
    </div>
  );
}
