'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _isomorphicUnfetch = require('isomorphic-unfetch');

var _isomorphicUnfetch2 = _interopRequireDefault(_isomorphicUnfetch);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (url, option, req, res) {
    var _config$csrftokenHead = config.csrftokenHeaderName,
        csrftokenHeaderName = _config$csrftokenHead === undefined ? 'csrf-token' : _config$csrftokenHead,
        _config$csrftokenCook = config.csrftokenCookieName,
        csrftokenCookieName = _config$csrftokenCook === undefined ? 'csrftoken' : _config$csrftokenCook,
        _config$cookieHeaderN = config.cookieHeaderName,
        cookieHeaderName = _config$cookieHeaderN === undefined ? 'custom-set-cookie' : _config$cookieHeaderN;


    var oldCsrf = _jsCookie2.default.get(csrftokenCookieName);

    option = option || {};
    option.credentials = 'include', option.headers = _extends(_defineProperty({
      'Cookie': req ? req.headers.cookie : document.cookie
    }, csrftokenHeaderName, oldCsrf), option.headers);

    return (0, _isomorphicUnfetch2.default)(url, option).then(function (r) {
      //cookie
      var setCookie = req ? r.headers._headers[cookieHeaderName] : r.headers.get(cookieHeaderName);
      if (req && res) {
        //server side 
        setCookie && res.header('set-cookie', setCookie);
      } else {
        //client side
        setCookie && (document.cookie = setCookie);
      }

      //csrf
      var csrf = r.headers.get(csrftokenHeaderName);
      if (res) {
        //server side, cookie
        csrf && res.cookie(csrftokenCookieName, csrf);
      } else {
        //client side 
        csrf && _jsCookie2.default.set(csrftokenCookieName, csrf);
      }

      return r;
    });
  };
};