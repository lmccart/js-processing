/**
 * @module Locales
 * @submodule Locales
 * @for p5
 */

'use strict';

var en = require('./en.json');
var es = require('./es.json');

var getUserLanguage = function() {
  var userLanguage = navigator.language || navigator.userLanguage;
  return userLanguage.split('-')[0];
};

var getString = function(str) {
  var defaultDict = en;
  var dict;

  switch (getUserLanguage()) {
    case 'en':
      dict = en;
      break;
    case 'es':
      dict = es;
      break;
    default:
      dict = en;
      break;
  }

  // Fallback to english dict or to the original string itself
  return dict[str] || defaultDict[str] || str;
};

function interpolate(str, args) {
  var regex = /{\d}/;
  var _r = function(p, c) {
    return p.replace(regex, c);
  };
  return args.reduce(_r, str);
}

var localize = function(str, args) {
  var localizedString = getString(str);

  if (args) {
    localizedString = interpolate(localizedString, args);
  }

  return localizedString;
};

module.exports = {
  __: localize
};
