"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);

    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
    var dbURI = 'mongodb://' + process.env.HDBRESALE_MONGODB_USER + ':' + process.env.HDBRESALE_MONGODB_PASSWORD + '@' + process.env.HDBRESALE_MONGODB_URL;

    this.mongoose = require('mongoose');
    this.mongoose.connect(dbURI);

    this.meta = this.mongoose.model('meta', new this.mongoose.Schema({
      lastIdx: Number,
      lastUpdate: Date,
      townList: [String],
      flatList: [String],
      monthList: [String],
      old_monthList: [String]
    }));

    this.time_series = this.mongoose.model('time_series', new this.mongoose.Schema({
      town: String,
      flat_type: String,
      time_series: {
        month: [String],
        count: [Number],
        min: [Number],
        max: [Number],
        median: [Number],
        mean: [Number],
        std: [Number],
        loess: [Number],
        loessError: [Number]
      }
    }));

    this.time_seriesOLD = this.mongoose.model('old_time_series', new this.mongoose.Schema({
      town: String,
      flat_type: String,
      time_series: {
        month: [String],
        count: [Number],
        min: [Number],
        max: [Number],
        median: [Number],
        mean: [Number],
        std: [Number]
      }
    }));

    this.Address = this.mongoose.model('address', new this.mongoose.Schema({
      town: String,
      street: String,
      block: String,
      postalCode: Number,
      lng: Number,
      lat: Number
    }));

    this.heatmap = this.mongoose.model('heatmap', new this.mongoose.Schema({
      flat_type: String,
      month: String,
      dataPoints: [{ lng: Number, lat: Number, weight: Number }]
    }));
  }

  (0, _createClass3.default)(_class, [{
    key: "getMeta",
    value: function getMeta() {
      return this.meta.findOne().exec(function (err) {
        if (err) throw err;
        console.log('Retrieved meta data');
      });
    }
  }, {
    key: "getAddressBook",
    value: function getAddressBook() {
      return this.Address.find().exec(function (err) {
        if (err) throw err;
        console.log('Address book loaded');
      });
    }
  }]);
  return _class;
}();

exports.default = _class;