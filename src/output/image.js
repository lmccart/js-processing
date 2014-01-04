define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.save = function() {
    this.open(this.curElement.elt.toDataURL('image/png'));
  };

  return Processing;
});