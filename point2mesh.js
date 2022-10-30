const meterstodegrees = require("meterstodegrees");
// // Base Latitude at Wakayama, Japan
// const latitude = 34;
// const meters = 10

// function to convert point to polygon
function point2mesh(lat, lon, meters, baseLat) {

    const latDegreesOf10m = meterstodegrees.latDegrees(baseLat, meters)
    const lonDegreesOf10m = meterstodegrees.lonDegrees(baseLat, meters)

    var lat1 = lat + latDegreesOf10m;
    var lon1 = lon + lonDegreesOf10m;
    var lat2 = lat - latDegreesOf10m;
    var lon2 = lon - lonDegreesOf10m;

    // cast all values to float
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);

    var polygon = [
        [lon1, lat1],
        [lon2, lat1],
        [lon2, lat2],
        [lon1, lat2],
        [lon1, lat1]
    ];

    return polygon;
}

exports.point2mesh = point2mesh;