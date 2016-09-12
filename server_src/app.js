import express from 'express'
import fallback from 'express-history-api-fallback'
import bodyParser from 'body-parser'
import compression from 'compression'
import path from 'path'
import InitDB from './util/InitDB.js'
import {toSVY, eucliDist2} from './util/geometry'

import regionData from '../data/region.json'
import planningAreaData from '../data/planning_area.json'
import subzoneData from '../data/subzone.json'

const app = express()
const root = path.join(__dirname, '../dist')

const db = new InitDB()

db.getAddressBook().then(docs => {
  const addressCache = {
    lastUpdate: Date.now(),
    data: docs
  }
  const heatmapKeys = new Set()
  docs.forEach(address => {
    address.heatmapKeys.forEach(k => {
      heatmapKeys.add(k)
    })
  })
  const regionSubset = regionData.filter(data => heatmapKeys.has(data.key))
  const planningAreaSubset = planningAreaData.filter(data => heatmapKeys.has(data.key))
  const subzoneSubset = subzoneData.filter(data => heatmapKeys.has(data.key))

  app.use(express.static(root))

  app.get('/list', function (req, res) {
    db.meta.findOne().exec((err, docs) => {
      if (err) console.error(err)
      else res.json(docs)
    })
  })

  app.get('/list/:key', function (req, res) {
    const key = req.params.key
    db.meta.findOne().exec((err, docs) => {
      if (err) console.error(err)
      else if (['town', 'flat', 'month'].indexOf(key) > -1) res.json(docs[key + 'List'])
      else res.json(docs)
    })
  })

  app.get('/time_series', function (req, res) {
    const query = {}
    if (req.query.town) query['town'] = req.query.town
    if (req.query.flat) query['flat_type'] = req.query.flat
    db.time_series.find(query).exec((err, docs) => {
      if (err) console.error(err)
      else res.json(docs)
    })
  })

  app.get('/heatmap', function (req, res) {
    const query = {}
    if (req.query.month) query['month'] = req.query.month
    if (req.query.flat) query['flat_type'] = req.query.flat
    db.heatmap.find(query).exec((err, docs) => {
      if (err) console.error(err)
      else res.json(docs)
    })
  })

  app.get('/choropleth', function (req, res) {
    const query = {}
    if (req.query.month) query['month'] = req.query.month
    if (req.query.flat) query['flat_type'] = req.query.flat
    db.choropleth.find(query).exec((err, docs) => {
      if (err) console.error(err)
      else res.json(docs)
    })
  })

  app.post('/choropleth/:level', function (req, res) {
    if (req.params.level === 'region') res.json(regionSubset)
    else if (req.params.level === 'planning_area') res.json(planningAreaSubset)
    else if (req.params.level === 'subzone') res.json(subzoneSubset)
    else res.sendStatus(404)
  })

  app.post('/nearby', function (req, res) {
    const {lat, lng, radius} = req.body
    const point = toSVY(lat, lng)
    const r2 = Math.pow(radius, 2)
    const nearbyStreets = addressCache.data
      .filter(a => eucliDist2(toSVY(a.lat, a.lng), point) < r2)
      .reduce((streets, a) => Object.assign(streets, {[a.street]: true}), {})
    res.json(Object.keys(nearbyStreets))
    if (Date.now() - addressCache.lastUpdate > 24 * 60 * 60 * 1000) {
      db.getAddressBook.then(docs => {
        addressCache.lastUpdate = Date.now()
        addressCache.data = docs
      })
    }
  })

  app.post('/subzone', function (req, res) {
    const {key} = req.body
    const nearbyStreets = addressCache.data
      .filter(a => a.heatmapKeys.indexOf(key) >= 0)
      .reduce((streets, a) => Object.assign(streets, {[a.street]: true}), {})
    res.json(Object.keys(nearbyStreets))
    if (Date.now() - addressCache.lastUpdate > 24 * 60 * 60 * 1000) {
      db.getAddressBook.then(docs => {
        addressCache.lastUpdate = Date.now()
        addressCache.data = docs
      })
    }
  })

  app.use(fallback('index.html', { root }))
})

app.use(compression())
app.use(bodyParser.json())

export default app
