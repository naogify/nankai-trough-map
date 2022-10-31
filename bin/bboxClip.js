#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const { parse } = require('csv-parse/sync');

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'depth-case2-06area-teibo-break.csv'), 'utf8')
  const data = parse(file);
  const outCSV = []

  for (let i = 1; i < data.length; i++) {
    const item = data[i];

    if (item[0] > 135.686175 && item[0] < 135.825221 && item[1] > 33.431871 && item[1] < 33.510771) {
      outCSV.push(item)
    }

    // ターミナルに進捗を表示　小数点第二位まで
    const progress = (i + 1) / data.length * 100
    process.stdout.write(` 進捗: ${i + 1}/${data.length} : ${progress.toFixed(2)}%\r`)

  }

  const csvWriter = createArrayCsvWriter({
    header: ['title', 'description'],
    path: "./bbox-kushimoto.csv",
  })

  csvWriter.writeRecords(outCSV)
}

exportCSV()
