import React, { useState, useEffect, useRef } from "react";
import { Map, AdvancedMarker, useMapsLibrary } from "@vis.gl/react-google-maps";

export default function LocationPicker({ value, onChange }) {
  const [coordinates, setCoordinates] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });
  const geocoderRef = useRef(null);

  const [camera, setCamera] = useState({
    center: coordinates,
    zoom: 13,
  });

  // Initialize the geocoder service once the library loads
  useEffect(() => {
    if (window.google?.maps && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, []);

  // Helper function to turn Lat/Lng into a text address
  const handleReverseGeocode = (lat, lng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results?.length) {
          onChange(results[0].formatted_address);
        }
      },
    );
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.detail.latLng;

    const newPosition = { lat, lng };

    setCoordinates(newPosition);

    setCamera((prev) => ({
      ...prev,
      center: newPosition,
    }));

    handleReverseGeocode(lat, lng);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="location"
        className="font-inter text-sm font-medium text-purple-600/80"
      >
        Location
      </label>

      {/* Autocomplete Input */}
      <AutocompleteInput
        value={value}
        onChange={onChange}
        setCoordinates={setCoordinates}
        setCamera={setCamera}
      />

      {/* Interactive Map */}
      <div className="h-60 w-full overflow-hidden rounded-xl border border-purple-600/20 bg-purple-50/40">
        <Map
          {...camera}
          onCameraChanged={(ev) => setCamera(ev.detail)}
          onClick={handleMapClick}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker to clear the console warning
        >
          {/* Swapped to AdvancedMarker */}
          <AdvancedMarker position={coordinates} />
        </Map>
      </div>
    </div>
  );
}

function AutocompleteInput({ value, onChange, setCoordinates, setCamera }) {
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setCoordinates({ lat, lng });
        onChange(place.formatted_address || "");
      }
    });
    return () => listener.remove();
  }, [places, onChange, setCoordinates]);

  return (
    <input
      ref={inputRef}
      id="location"
      name="location"
      type="text"
      value={value || ""} // Fallback to empty string to prevent controlled/uncontrolled input warnings
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search for an address..."
      className="w-full rounded-md border border-purple-600/20 bg-purple-50/40 px-4 py-2.5
                 font-inter text-sm text-purple-800 placeholder:text-purple-600/40
                 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600
                 transition-colors"
    />
  );
}
