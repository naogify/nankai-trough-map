const meterstodegrees = require("meterstodegrees");
const bigDecimal = require('js-big-decimal');

// // Base Latitude at Wakayama, Japan
// const latitude = 34;
// const meters = 10

// function to convert point to polygon
function point2mesh(lat, lon, meters) {

    const baseLat = parseInt(lat);
    console.log(baseLat);

    const latDegreesOf10m = meterstodegrees.latDegrees(baseLat, meters)
    const lonDegreesOf10m = meterstodegrees.lonDegrees(baseLat, meters)

    console.log(latDegreesOf10m);
    console.log(lonDegreesOf10m);

    let lon1 = bigDecimal.add(`${lon}`, `${lonDegreesOf10m}`);
    let lat1 = bigDecimal.subtract(`${lat}`, `${latDegreesOf10m}`);

    // cast all values to float
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);

    console.log(lat);
    console.log(lon);
    console.log(lat1);
    console.log(lon1);

    var coordinates = [
        [
            [lon, lat],
            [lon1, lat],
            [lon1, lat1],
            [lon, lat1],
            [lon, lat],
        ]
    ];

    return coordinates;
}

exports.point2mesh = point2mesh;