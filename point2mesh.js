const meterstodegrees = require("meterstodegrees");
const bigDecimal = require('js-big-decimal');

// function to convert point to polygon
function point2mesh(lat, lon, meters) {

    const baseLat = parseInt(lat);

    const latDegreesOf10m = meterstodegrees.latDegrees(baseLat, meters)
    const lonDegreesOf10m = meterstodegrees.lonDegrees(baseLat, meters)

    let lon1 = bigDecimal.add(`${lon}`, `${lonDegreesOf10m}`);
    let lat1 = bigDecimal.subtract(`${lat}`, `${latDegreesOf10m}`);

    // cast all values to float
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);

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