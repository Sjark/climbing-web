import { components } from "../../../@types/buldreinfo/swagger";

export function getDistanceWithUnit(
  approach: components["schemas"]["Approach"],
) {
  if (!approach) {
    return null;
  }
  const m = approach.distance;
  if (m > 1000) {
    return Math.round(m / 100) / 10 + "km";
  }
  return Math.round(m) + "m";
}

export function convertGpxToCoordinates(gpx: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpx, "text/xml");
  const children = xmlDoc.querySelectorAll("trkpt");
  const coords = [];
  for (let i = 0; i < children.length; i++) {
    const trkpt = children[i];
    const latitude = trkpt.getAttribute("lat");
    const longitude = trkpt.getAttribute("lon");
    let elevation = 0;
    trkpt.childNodes.forEach((c) => {
      if (c.nodeName === "ele") {
        elevation = parseFloat(c.firstChild.nodeValue);
      }
    });
    if (
      coords.length === 0 ||
      i === children.length - 1 ||
      calculateDistanceBetweenCoordinates(
        coords[coords.length - 1].latitude,
        coords[coords.length - 1].longitude,
        latitude,
        longitude,
      ) > 10
    ) {
      coords.push({
        latitude,
        longitude,
        elevation,
        elevationSource: elevation > 0 && "GPX",
      });
    }
  }
  if (coords.length < 2) {
    return null;
  }
  return coords;
}

export function convertTcxToCoordinates(gpx: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpx, "text/xml");
  const children = xmlDoc.querySelectorAll("Trackpoint");
  const coords = [];
  for (let i = 0; i < children.length; i++) {
    const trackpoint = children[i];
    let latitude = 0;
    let longitude = 0;
    let elevation = 0;
    trackpoint.childNodes.forEach((c) => {
      if (c.nodeName === "Position") {
        const position = c;
        position.childNodes.forEach((cPos) => {
          if (cPos.nodeName === "LatitudeDegrees") {
            latitude = parseFloat(cPos.firstChild.nodeValue);
          } else if (cPos.nodeName === "LongitudeDegrees") {
            longitude = parseFloat(cPos.firstChild.nodeValue);
          }
        });
      } else if (c.nodeName === "AltitudeMeters") {
        elevation = parseFloat(c.firstChild.nodeValue);
      }
    });
    if (latitude > 0 && longitude > 0) {
      if (
        coords.length === 0 ||
        i === children.length - 1 ||
        calculateDistanceBetweenCoordinates(
          coords[coords.length - 1].latitude,
          coords[coords.length - 1].longitude,
          latitude,
          longitude,
        ) > 10
      ) {
        coords.push({
          latitude,
          longitude,
          elevation,
          elevationSource: elevation > 0 && "TCX",
        });
      }
    }
  }
  if (coords.length < 2) {
    return null;
  }
  return coords;
}

export function calculateDistanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c * 1000; // Distance in meter
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
