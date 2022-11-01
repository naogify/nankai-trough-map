const compareNow = (arriveTime, nextArriveTime, currentTime) => {
  return [
    'all',
    [
      'all',
      ['!=', ['to-number', ['get', arriveTime]], -9999], // もし到達時間_30cm_s が -9999 なら
      ['<=', ['to-number', ['get', arriveTime]], currentTime], // 現在の時間が「到達時間_01cm_s」よりも大きい
    ],
    ['case',
      ['==', ['to-number', ['get', nextArriveTime]], -9999], // もし到達時間_30cm_s が -9999 なら
      ['>', ['to-number', ['get', '到達時間_最高水位_s']], currentTime], // 到達時間_最高水位_s と現在の時間を比較して小さいか
      ['>', ['to-number', ['get', nextArriveTime]], currentTime], // 到達時間_30cm_s と現在の時間を比較して小さければ
    ]
  ]
}

const baseLayer = {
  type: 'fill-extrusion',
  source: 'nankai-trough',
  'source-layer': 'g-simplestyle-v1',
  paint: {
    'fill-extrusion-color': '#ff0000',
    'fill-extrusion-opacity': 0.8,
    'fill-extrusion-vertical-gradient': true,
  }
}

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://cdn.geolonia.com/style/geolonia/gsi/en.json',
  center: [135.778927, 33.471312],
  pitch: 75,
  bearing: 24,
  zoom: 17.36,
  hash: true,
  minZoom: 10,
  maxZoom: 20,
  maxPitch: 85
});

map.on('load', () => {

  map.addSource('terrainSource', {
    type: 'raster-dem',
    url: 'https://tileserver.geolonia.com/gsi-dem/tiles.json?key=YOUR-API-KEY',
    tileSize: 512,
  });

  map.setTerrain({
    source: "terrainSource"
  });

  map.addLayer(
    {
      id: 'hillshade',
      type: 'hillshade',
      source: 'terrainSource',
      paint: {
        "hillshade-shadow-color": "#808080"
      },
    },
    'poi'
  );

  map.addSource('nankai-trough', {
    type: 'vector',
    url: 'https://tileserver.geolonia.com/naoki-nankai-trough-tsunami-v1/tiles.json?key=YOUR-API-KEY'
  });

  map.addLayer({
    id: 'tsunami-1cm',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 0.01,
      'fill-extrusion-color': '#FFF323'
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-30cm',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 0.3,
      'fill-extrusion-color': '#FFCA03'
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-1m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 1,
      'fill-extrusion-color': '#FF5403'
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-3m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 3,
      'fill-extrusion-color': '#F90716'
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-5m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 5,
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-10m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 10,
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-20m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 20,
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-30m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 30,
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-40m',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': 40,
    }
  }, 'poi');

  map.addLayer({
    id: 'tsunami-highest',
    ...baseLayer,
    paint: {
      ...baseLayer.paint,
      'fill-extrusion-height': ['to-number', ['get', '浸水深公表値_m']],
    }
  }, 'poi');

  map.addSource('kushmoto-hazard-shelter', {
    type: 'vector',
    url: 'https://naogify.github.io/kushimoto-hazard-shelter-api/tiles/tiles.json'
  });

  map.loadImage(
    'https://naogify.github.io/nankai-trough-map/kushimoto-shelter.png',
    function (error, image) {
      if (error) throw error;
      map.addImage('kushimoto-shelter', image);

      map.addLayer({
        id: 'shelters',
        type: 'symbol',
        source: 'kushmoto-hazard-shelter',
        'source-layer': 'g-simplestyle-v1',
        minzoom: 15,
        layout: {
          'icon-image': 'kushimoto-shelter',
          'icon-allow-overlap': true,
          'icon-size': 0.7,
          'icon-offset': [0, -42],
        },
      });
    }
  );

  const filterBy = (currentTime) => {

    map.setFilter('tsunami-1cm', compareNow('到達時間_01cm_s', '到達時間_30cm_s', currentTime));
    map.setFilter('tsunami-30cm', compareNow('到達時間_30cm_s', '到達時間_01m_s', currentTime));
    map.setFilter('tsunami-1m', compareNow('到達時間_01m_s', '到達時間_03m_s', currentTime));
    map.setFilter('tsunami-3m', compareNow('到達時間_03m_s', '到達時間_05m_s', currentTime));
    map.setFilter('tsunami-5m', compareNow('到達時間_05m_s', '到達時間_10m_s', currentTime));
    map.setFilter('tsunami-10m', compareNow('到達時間_10m_s', '到達時間_20m_s', currentTime));
    map.setFilter('tsunami-20m', compareNow('到達時間_20m_s', '到達時間_30m_s', currentTime));
    map.setFilter('tsunami-30m', compareNow('到達時間_30m_s', '到達時間_40m_s', currentTime));
    map.setFilter('tsunami-40m', compareNow('到達時間_40m_s', '到達時間_最高水位_s', currentTime));
    map.setFilter('tsunami-highest', [
      'all',
      ['<=', ['to-number', ['get', '到達時間_最高水位_s']], currentTime], // 現在の時間が 到達時間_最高水位_s より大きいかつ、他の到達時間より大きい or 他の到達時間が -9999
      ['any', ['<=', ['to-number', ['get', '到達時間_01cm_s']], currentTime], ['==', ['to-number', ['get', '到達時間_01cm_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_30cm_s']], currentTime], ['==', ['to-number', ['get', '到達時間_30cm_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_01m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_01m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_03m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_03m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_05m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_05m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_10m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_10m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_20m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_20m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_30m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_30m_s']], -9999]],
      ['any', ['<=', ['to-number', ['get', '到達時間_40m_s']], currentTime], ['==', ['to-number', ['get', '到達時間_40m_s']], -9999]],
    ]);
  }

  filterBy(-1)

  const currentTimeLabel = document.getElementById('currentTime');

  document.getElementById("slider").addEventListener("input", (e) => {
    const currentTime = parseInt(e.target.value, 10);
    currentTimeLabel.innerHTML = `${currentTime / 60}min`;
    filterBy(currentTime);
  });

});