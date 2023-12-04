import './style.css';
import { Map, View } from 'ol';
import WKT from 'ol/format/WKT.js';
import initGeosJs from 'geos-wasm';
import { geojsonToGeosGeom } from "geos-wasm/helpers"
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';

const geos = await initGeosJs()

// polygon near PT Len Industri, Bandung, Indonesia
const json = JSON.parse(`
{"coordinates": [
    [
      [
        107.61787416082842,
        -6.948521370811818
      ],
      [
        107.61801626219233,
        -6.9499067565422905
      ],
      [
        107.61998538108651,
        -6.949876529988558
      ],
      [
        107.62026450876613,
        -6.948838750448488
      ],
      [
        107.61935607504779,
        -6.948128424297394
      ],
      [
        107.61787416082842,
        -6.948521370811818
      ]
    ]
  ],
  "type": "Polygon"
}`)

const geomPtr = geojsonToGeosGeom(json, geos)
const writerWKT = geos.GEOSWKTWriter_create()
const wkt = geos.GEOSWKTWriter_write(writerWKT, geomPtr)
console.log(wkt) // => POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))

const format = new WKT();

const raster = new TileLayer({
  source: new OSM(),
});

const feature = format.readFeature(wkt, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
});

const vector = new VectorLayer({
  source: new VectorSource({
    features: [feature],
  }),
});

const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [-6.8, 107.7],
    zoom: 6,
  }),
});

geos.GEOSGeom_destroy(geomPtr)
geos.GEOSWKTWriter_destroy(writerWKT)
geos.GEOSFree(wkt)


