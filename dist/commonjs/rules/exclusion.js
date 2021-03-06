'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExclusionRule = undefined;

var _validationRule = require('../validation-rule');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExclusionRule = exports.ExclusionRule = function ExclusionRule(config) {
  _classCallCheck(this, ExclusionRule);

  return new _validationRule.ValidationRule('exclusion', config);
};