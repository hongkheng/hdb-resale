'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.processData = processData;
exports.smoothData = smoothData;
exports.updateTimeSeries = updateTimeSeries;
exports.populateHeatMap = populateHeatMap;
exports.updateOneAddress = updateOneAddress;
exports.updateHMdb = updateHMdb;
exports.splitTask = splitTask;
exports.updateMeta = updateMeta;
exports.closeConnection = closeConnection;

var _loess = require('loess');

var _loess2 = _interopRequireDefault(_loess);

var _InitDB = require('./util/InitDB.js');

var _InitDB2 = _interopRequireDefault(_InitDB);

var _fetchExtRes = require('./util/fetchExtRes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var math = require('mathjs');
var jStat = require('jStat').jStat;


var start = Date.now();
var db = exports.db = new _InitDB2.default();

function processData(_ref) {
  var data = _ref.data;
  var meta = _ref.meta;

  console.log('Processing time-series data');
  var processed = [];
  var townList = meta.townList;
  var flatList = meta.flatList;

  try {
    townList.forEach(function (town) {
      flatList.forEach(function (flat) {
        var byMonth = _(data).filter(function (record) {
          return record.town.trim() === town && record.flat_type.trim() === flat;
        }).groupBy(function (record) {
          return record.month;
        }).value();
        var month = [];
        var count = [];
        var min = [];
        var max = [];
        var median = [];
        var mean = [];
        var std = [];
        (0, _keys2.default)(byMonth).sort().forEach(function (mth) {
          month.push(mth);
          count.push(byMonth[mth].length);
          var resale_price = byMonth[mth].map(function (record) {
            return +record.resale_price;
          });
          min.push(math.min(resale_price));
          max.push(math.max(resale_price));
          median.push(math.median(resale_price));
          mean.push(math.mean(resale_price));
          std.push(math.std(resale_price));
        });
        if (month.length) {
          min = math.subtract(median, min);
          max = math.subtract(max, median);
          mean = math.multiply(math.round(math.divide(mean, 1000)), 1000);
          std = math.multiply(math.round(math.divide(std, 100)), 100);
        }
        processed.push({
          'town': town,
          'flat_type': flat,
          'time_series': { month: month, count: count, min: min, max: max, median: median, mean: mean, std: std }
        });
      });
    });
  } catch (err) {
    return _promise2.default.reject(err);
  }
  return _promise2.default.resolve({ data: processed, meta: meta });
}

var z = jStat.normal.inv(0.95, 0, 1);
function smoothData(y, x, w, std) {
  if (y.length < 30) return {};
  var fit = new _loess2.default({ y: y, x: x, w: w }, { span: 0.3 });
  var predict = fit.predict();

  var variance = math.square(std);
  var halfwidth = predict.weights.map(function (weight, idx) {
    var V1 = math.sum(weight);
    var V2 = math.multiply(weight, weight);
    var bias = math.square(predict.residuals[idx]);
    var totalVariance = math.multiply(math.add(bias, variance), weight);
    var intervalEstimate = Math.sqrt(totalVariance / (V1 - V2 / V1));
    return intervalEstimate * z;
  });

  return { loess: math.round(predict.fitted), loessError: math.round(halfwidth) };
}

function updateTimeSeries(_ref2) {
  var data = _ref2.data;
  var meta = _ref2.meta;

  console.log('Begin updating time-series');
  function updateOneTS(data) {
    if (!data.length) return 'Time-series updated';
    var entry = data.pop();
    return db.time_seriesOLD.findOne({ town: entry.town, flat_type: entry.flat_type }).exec().then(function (old) {
      var month = old.time_series.month.concat(entry.time_series.month);
      var count = old.time_series.count.concat(entry.time_series.count);
      var min = old.time_series.min.concat(entry.time_series.min);
      var max = old.time_series.max.concat(entry.time_series.max);
      var median = old.time_series.median.concat(entry.time_series.median);
      var mean = old.time_series.mean.concat(entry.time_series.mean);
      var std = old.time_series.std.concat(entry.time_series.std);

      entry.time_series = { month: month, count: count, min: min, max: max, median: median, mean: mean, std: std };
      (0, _assign2.default)(entry.time_series, smoothData(mean, month.map(function (mth) {
        return meta.monthList.indexOf(mth);
      }), count, std));

      return db.time_series.findOneAndUpdate({ town: entry.town, flat_type: entry.flat_type }, { time_series: entry.time_series }, { upsert: true }).exec();
    }).then(function () {
      return updateOneTS(data);
    });
  }
  return updateOneTS(data);
}

function populateHeatMap(addressBook, filtered) {
  console.log('Processing heat maps data');
  var heatmap = [];
  var unresolved = [];
  var lastIdx = addressBook.length;
  var counter = filtered.length;
  function resolveAddress(record) {
    if (counter % 500 === 0) console.log(counter);
    counter--;
    var address = addressBook.find(function (address) {
      return address.street === record.street_name.trim() && address.block === record.block.trim();
    });
    if (address) {
      address['flag'] = true;
      address = _promise2.default.resolve(address);
    } else {
      address = (0, _fetchExtRes.geocode)(record.block.trim(), record.street_name.trim(), record.town.trim());
    }
    return address.then(function (address) {
      if (address) {
        if (!address.flag) {
          addressBook.push(address);
          console.log('New address:', address);
        }
        if (!address.lng || !address.lat) return;
        var dataPoint = {
          'lng': address.lng,
          'lat': address.lat,
          'weight': Math.round(+record.resale_price / +record.floor_area_sqm)
        };
        var idx = heatmap.findIndex(function (dataset) {
          return dataset.month === record.month && dataset.flat_type === record.flat_type.trim();
        });
        if (idx < 0) {
          idx = heatmap.push({
            'flat_type': record.flat_type.trim(),
            'month': record.month,
            'dataPoints': []
          }) - 1;
        }
        heatmap[idx].dataPoints.push(dataPoint);
      } else unresolved.push(record);
    });
  }

  return filtered.reduce(function (promiseChain, record) {
    return promiseChain.then(function () {
      return resolveAddress(record);
    });
  }, _promise2.default.resolve()).then(function () {
    return {
      'newAddresses': addressBook.slice(lastIdx),
      'heatmap': heatmap,
      'unresolved': unresolved
    };
  });
}

function updateOneAddress(data) {
  if (!data.length) return 'Address book updated';
  if (data.length % 10 === 0) console.log(data.length);
  var entry = data.pop();
  return db.Address.findOneAndUpdate({ block: entry.block, street: entry.street }, entry, { upsert: true }).exec(function (err) {
    if (err) throw err;
  }).then(function () {
    return updateOneAddress(data);
  });
}

function updateHMdb(pkg) {
  console.log('Begin updating heat maps');
  function updateOneHM(data) {
    if (!data.length) return 'Heat maps updated';
    var entry = data.pop();
    return db.heatmap.findOneAndUpdate({ flat_type: entry.flat_type, month: entry.month }, { dataPoints: entry.dataPoints }, { upsert: true }).exec(function (err) {
      if (err) throw err;
    }).then(function () {
      return updateOneHM(data);
    });
  }

  if (pkg.unresolved.length) {
    console.log('UNRESOLVED ADDRESSES');
    console.log(pkg.unresolved);
  }
  return _promise2.default.all([updateOneHM(pkg.heatmap), updateOneAddress(pkg.newAddresses)]);
}

function splitTask(src) {
  var townList = {};
  var flatList = {};
  var monthList = {};
  src[2].forEach(function (record) {
    townList[record.town.trim()] = true;
    flatList[record.flat_type.trim()] = true;
    monthList[record.month] = true;
  });
  townList = (0, _keys2.default)(townList).sort();
  flatList = (0, _keys2.default)(flatList).sort();
  monthList = (0, _keys2.default)(monthList).sort();
  monthList = src[0].old_monthList.concat(monthList);

  var lastMonthList = src[0].monthList;
  var lastMonth = lastMonthList[lastMonthList.length - 1];
  var filtered = src[2].filter(function (record) {
    return record.month >= lastMonth;
  });
  console.log('Last month:', lastMonth);
  console.log('Records retrieved:', src[2].length);

  return _promise2.default.all([processData({ data: src[2], meta: { townList: townList, flatList: flatList, monthList: monthList } }).then(updateTimeSeries), populateHeatMap(src[1], filtered).then(updateHMdb)]).then(function (msg) {
    return {
      'msg': [msg[0]].concat(msg[1]),
      'meta': { 'lastUpdate': new Date(), townList: townList, flatList: flatList, monthList: monthList }
    };
  });
}

function updateMeta(info) {
  return db.meta.findOneAndUpdate({}, info.meta).exec(function (err) {
    if (err) throw err;
  }).then(function () {
    return info.msg;
  });
}

function closeConnection() {
  db.mongoose.disconnect();
  console.log('Total time taken:', Date.now() - start);
}

_promise2.default.all([db.getMeta(), db.getAddressBook(), (0, _fetchExtRes.fetchData)()]).then(splitTask).then(updateMeta).then(console.log).catch(console.error).then(closeConnection);