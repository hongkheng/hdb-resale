'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.toSVY = toSVY;
exports.eucliDist2 = eucliDist2;

var _proj = require('proj4');

var _proj2 = _interopRequireDefault(_proj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SVY21 = '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs';
var SVY21proj = (0, _proj2.default)('WGS84', SVY21);

function toSVY(lat, lng) {
  return SVY21proj.forward([lng, lat]);
}

function eucliDist2(_ref, _ref2) {
  var _ref4 = (0, _slicedToArray3.default)(_ref, 2);

  var x1 = _ref4[0];
  var y1 = _ref4[1];

  var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

  var x2 = _ref3[0];
  var y2 = _ref3[1];

  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}