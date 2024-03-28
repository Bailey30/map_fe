import axios, { AxiosResponse, AxiosError } from "axios";
import {
  hexGrid,
  collect,
  BBox,
  Units,
  polygon,
  featureCollection,
  point,
  getCoord,
  FeatureCollection,
  Point,
  Properties,
} from "@turf/turf";
import { GeoJSONFeature, Location, GeoJSON } from "./types";
import { HeatmapLayer } from "react-map-gl";
import { late } from "zod";
import { MapboxInterpolateHeatmapLayer } from "../utils/mapbox-gl-interpolate-heatmap";
import { warn } from "console";

export function moveCameraTo(map: any, long: number, lat: number) {
  map.current.flyTo({
    center: [long, lat],
    essential: true,
    zoom: 10,
  });
}

export function createGeojson(data: Location[]) {
  const features: GeoJSONFeature[] = [];

  data.forEach((location) => {
    const coordinates: [number, number] = [
      location.longitude,
      location.latitude,
    ];

    const properties = {
      name: location.name,
      price: location.Review && location.Review[0].price,
      locationId: location.id,
    };

    const feature: GeoJSONFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
      properties: properties,
    };

    features.push(feature);
  });

  const geojson: GeoJSON = {
    type: "FeatureCollection",
    features: features,
  };

  // return JSON.stringify(geojson);
  return geojson;
}

const MAX_ZOOM_LEVEL = 9;
export const heatmapLayer: HeatmapLayer = {
  id: "heatmap",
  // maxzoom: MAX_ZOOM_LEVEL,
  type: "heatmap",
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    // "heatmap-weight": ["interpolate", ["linear"], ["get", "price"]],
    "heatmap-weight": {
      property: "price",
      stops: [
        [0, 1],
        [8, 1],
      ],
    },
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    // "heatmap-intensity": [
    //   "interpolate",
    //   ["linear"],
    //   ["zoom"],
    //   0,
    //   1,
    //   MAX_ZOOM_LEVEL,
    //   3,
    // ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      0.9,
      "rgb(255,201,101)",
    ],
    // Adjust the heatmap radius by zoom level
    "heatmap-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      2,
      MAX_ZOOM_LEVEL,
      100,
    ],
    // Transition from heatmap to circle layer by zoom level
    // "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
  },
};

export function createHeatmapData(data: Location[]) {
  const values: any = [];

  data.forEach((location) => {
    if (!location.Review) return;
    const latestReview = location.Review.length - 1;
    // values.push({
    //   lat: location.latitude,
    //   lon: location.longitude,
    //   val: location.Review[latestReview].price,
    // });

    values.push([
      location.longitude,
      location.latitude,
      location.Review[latestReview].price,
    ]);
  });

  return values;
}

export function createHeatmapLayer(
  data: Location[],
): MapboxInterpolateHeatmapLayer {
  const layer = new MapboxInterpolateHeatmapLayer({
    data: createHeatmapData(data),
    id: "priceHeatmap",
    framebufferFactor: 0,
  });
  console.log(layer.data);
  return layer;
}
