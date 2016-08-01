'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.fetchData = fetchData;
exports.geocode = geocode;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchData() {
  var batchSize = 10000;
  var resID = [
  // '8c00bf08-9124-479e-aeca-7cc411d884c4',
  '83b2fc37-ce8c-4df4-968b-370fd818138b'];

  function fetchOneDataset(dataset, offset, records) {
    var fetchURL = 'https://data.gov.sg/api/action/datastore_search?' + 'resource_id=' + dataset + '&sort=_id&' + 'limit=' + batchSize + '&offset=' + offset;
    return (0, _nodeFetch2.default)(fetchURL).then(function (data) {
      return data.json();
    }).then(function (json) {
      records = records.concat(json.result.records);
      console.log('fetchOneDataset', dataset, offset);
      if (offset + batchSize < json.result.total) return fetchOneDataset(dataset, offset + batchSize, records);else return records;
    }).catch(function (err) {
      if (err) throw err;
    });
  }

  return _promise2.default.all(resID.map(function (dataset) {
    return fetchOneDataset(dataset, 0, []);
  })).then(function (recordSet) {
    return recordSet.reduce(function (combined, records) {
      return combined.concat(records);
    }, []);
  });
}

function geocode(block, street, town) {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + block + ' ' + street.replace(/\'/, '') + ' SINGAPORE&key=' + process.env.GOOGLEMAPS_SERVER_KEY;

  return new _promise2.default(function (resolve, reject) {
    setTimeout(resolve, 150, (0, _nodeFetch2.default)(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.status !== 'OK') throw new Error(data.status);
      var postalCode = data.results[0].address_components.find(function (el) {
        return el.types.indexOf('postal_code') > -1;
      });
      var lng = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;
      postalCode = postalCode ? postalCode.short_name : null;
      lng = lng === 103.819836 ? null : lng;
      lat = lat === 1.352083 ? null : lat;
      return {
        'town': town,
        'street': street,
        'block': block,
        'postalCode': postalCode,
        'lng': lng,
        'lat': lat
      };
    }));
  });
}