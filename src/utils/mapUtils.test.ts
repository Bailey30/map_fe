import { createGeojson } from "./mapUtils";
import { Location } from "./types";
describe("mapUtils tests", () => {
  test("createGeojson should return a geojson object", () => {
    const testGeojson = JSON.stringify({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [1.2345, 6.789],
          },
          properties: {
            name: "location1",
            price: 1,
            locationId: 1,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [1.2345, 6.789],
          },
          properties: {
            name: "location2",
            price: 2,
            locationId: 2,
          },
        },
      ],
    });
    const testData: Location[] = [
      {
        id: 1,
        name: "location1",
        longitude: 1.2345,
        latitude: 6.789,
        Review: [
          {
            id: 1,
            price: 1,
            createdAt: "12",
            updatedAt: "12",
            comments: "",
            rating: 1,
            locationId: 1,
            creatorId: 1,
          },
        ],
      },
      {
        id: 2,
        name: "location2",
        longitude: 1.2345,
        latitude: 6.789,
        Review: [
          {
            id: 1,
            price: 2,
            createdAt: "12",
            updatedAt: "12",
            comments: "",
            rating: 1,
            locationId: 2,
            creatorId: 2,
          },
        ],
      },
    ];

    const geojson = createGeojson(testData);
    expect(geojson).toEqual(testGeojson);
  });
});
