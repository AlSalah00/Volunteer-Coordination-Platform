import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";

/**
 * Same Map/AdvancedMarker primitives as LocationPicker, deliberately
 * without an onClick handler or a draggable marker. this is a preview,
 * not an editor. Uncontrolled (defaultCenter/defaultZoom) since there's
 * no need to persist camera position. Panning and zooming still work,
 * they just don't do anything beyond looking around.
 */
export default function LocationMapPreview({ lat, lng, address }) {
  if (lat == null || lng == null) {
    return (
      <div className="flex h-60 w-full items-center justify-center rounded-xl border border-purple-600/20 bg-purple-50/40">
        <p className="font-inter text-xs text-purple-600/40">No location set</p>
      </div>
    );
  }

  const position = { lat, lng };

  return (
    <div className="h-60 w-full overflow-hidden rounded-xl border border-purple-600/20 bg-purple-50/40">
      <Map defaultCenter={position} defaultZoom={15} mapId="DEMO_MAP_ID">
        <AdvancedMarker position={position} title={address} />
      </Map>
    </div>
  );
}
