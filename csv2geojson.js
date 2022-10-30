#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync');
const { point2mesh } = require('./point2mesh')

// create 10m mesh at around latitude 34 degrees (Wakayama, Japan)
const baseLat = 34;
const meters = 10;

// read csv file 1row at a time, and create geojson polygon feature and read existing geojson file and append new feature to it
const csv2geojson = (csvFile, geojsonFile) => {
  const csv = fs.readFileSync(csvFile, 'utf8')
  const records = parse(csv, { columns: true, skip_empty_lines: true })

  // add new feature to geojson by for loop
  for (const record of records) {

    // if geojson file does not exist, create it
    if (!fs.existsSync(geojsonFile)) {
      const geojson = {
        type: 'FeatureCollection',
        features: []
      }
      fs.writeFileSync(geojsonFile, JSON.stringify(geojson))
    }

    // read geojson file
    const geojson = JSON.parse(fs.readFileSync(geojsonFile, 'utf8'))

    const coordinates = point2mesh(record, baseLat, meters)

    delete record.lat
    delete record.lon

    // create new feature of polygon type and add it to geojson
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coordinates
      },
      properties: {
        ...record
      }
    }
    geojson.features.push(feature)


    // write geojson file
    fs.writeFileSync(geojsonFile, JSON.stringify(geojson))
  
  }

}

csv2geojson('depth-case2-06area-teibo-break.csv', 'data.geojson')
