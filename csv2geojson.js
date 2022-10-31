#!/usr/bin/env node

const fs = require('fs')
const { parse } = require('csv-parse/sync');
const { point2mesh } = require('./point2mesh')

// create 10m mesh at around latitude 34 degrees (Wakayama, Japan)
const meters = 10;

// read csv file 1row at a time, and create geojson polygon feature and read existing geojson file and append new feature to it
const csv2geojson = (csvFile, geojsonFile) => {
  const csv = fs.readFileSync(csvFile, 'utf8')
  const records = parse(csv, { columns: true, skip_empty_lines: true })

  // if geojson file does not exist, create it
  if (!fs.existsSync(geojsonFile)) {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    }
    fs.writeFileSync(geojsonFile, JSON.stringify(geojson))
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

        // read geojson file
        const geojson = JSON.parse(fs.readFileSync(geojsonFile, 'utf8'))

        const coordinates = point2mesh(record.lat, record.lon, meters)
    
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
            "浸水深公表値_m": record["浸水深公表値_m"],
            "到達時間_01cm_s": record["到達時間_01cm_s"],
            "到達時間_30cm_s": record["到達時間_30cm_s"],
            "到達時間_01m_s": record["到達時間_01m_s"],
            "到達時間_03m_s": record["到達時間_03m_s"],
            "到達時間_05m_s": record["到達時間_05m_s"],
            "到達時間_10m_s": record["到達時間_10m_s"],
            "到達時間_20m_s": record["到達時間_20m_s"],
            "到達時間_30m_s": record["到達時間_30m_s"],
            "到達時間_40m_s": record["到達時間_40m_s"],
            "到達時間_最高水位_s": record["到達時間_最高水位_s"],
            "参考値:浸水深_m": record["参考値:浸水深_m"],
            "参考値:地殻変動後の標高_m": record["参考値:地殻変動後の標高_m"],
            "参考値:隆起量_m": record["参考値:隆起量_m"],
          }
        }
        geojson.features.push(feature)
    
        // write geojson file
        fs.writeFileSync(geojsonFile, JSON.stringify(geojson))
    
        // ターミナルに進捗を表示　小数点第二位まで
        const progress = (i + 1) / records.length * 100
        process.stdout.write(` 進捗: ${i + 1}/${records.length} : ${progress.toFixed(2)}%\r`)
  }

}

csv2geojson('bbox-kushimoto.csv', 'data.geojson')
