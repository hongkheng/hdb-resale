'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHistoryApiFallback = require('express-history-api-fallback');

var _expressHistoryApiFallback2 = _interopRequireDefault(_expressHistoryApiFallback);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _InitDB = require('./util/InitDB.js');

var _InitDB2 = _interopRequireDefault(_InitDB);

var _geometry = require('./util/geometry');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var root = _path2.default.join(__dirname, '../public');

var db = new _InitDB2.default();
var addressCache = { lastUpdate: Date.now() };
db.getAddressBook().then(function (docs) {
  addressCache.data = docs;
});

app.use(_express2.default.static(root));
app.use(_bodyParser2.default.json());

app.get('/list', function (req, res) {
  db.meta.findOne().exec(function (err, docs) {
    if (err) console.error(err);else res.json(docs);
  });
});

app.get('/list/:key', function (req, res) {
  var key = req.params.key;
  db.meta.findOne().exec(function (err, docs) {
    if (err) console.error(err);else if (['town', 'flat', 'month'].indexOf(key) > -1) res.json(docs[key + 'List']);else res.json(docs);
  });
});

app.get('/time_series', function (req, res) {
  var query = {};
  if (req.query.town) query['town'] = req.query.town;
  if (req.query.flat) query['flat_type'] = req.query.flat;
  db.time_series.find(query).exec(function (err, docs) {
    if (err) console.error(err);else res.json(docs);
  });
});

app.get('/heatmap', function (req, res) {
  var query = {};
  if (req.query.month) query['month'] = req.query.month;
  if (req.query.flat) query['flat_type'] = req.query.flat;
  db.heatmap.find(query).exec(function (err, docs) {
    if (err) console.error(err);else res.json(docs);
  });
});

app.post('/nearby', function (req, res) {
  if (!addressCache.data) res.json([]);else {
    (function () {
      var _req$body = req.body;
      var lat = _req$body.lat;
      var lng = _req$body.lng;
      var radius = _req$body.radius;

      var point = (0, _geometry.toSVY)(lat, lng);
      var r2 = Math.pow(radius, 2);
      var nearbyStreets = addressCache.data.filter(function (a) {
        return (0, _geometry.eucliDist2)((0, _geometry.toSVY)(a.lat, a.lng), point) < r2;
      }).reduce(function (streets, a) {
        streets[a.street] = true;
        return streets;
      }, {});
      res.json((0, _keys2.default)(nearbyStreets));
      if (Date.now() - addressCache.lastUpdate > 24 * 60 * 60 * 1000) {
        db.getAddressBook.then(function (docs) {
          addressCache.lastUpdate = Date.now();
          addressCache.data = docs;
        });
      }
    })();
  }
});

app.use((0, _expressHistoryApiFallback2.default)('index.html', { root: root }));

exports.default = app;