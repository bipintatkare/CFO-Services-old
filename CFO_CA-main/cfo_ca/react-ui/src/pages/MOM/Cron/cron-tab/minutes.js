import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';

var MinutesCron = /*#__PURE__*/function (_Component) {
  _inherits(MinutesCron, _Component);

  var _super = _createSuper(MinutesCron);

  function MinutesCron() {
    _classCallCheck(this, MinutesCron);

    return _super.apply(this, arguments);
  }

  _createClass(MinutesCron, [{
    key: "onChange",
    value: function onChange(e) {
      if (e.target.value > 0 && e.target.value < 60 || e.target.value === '') {
        var val = ['0', '*', '*', '*', '*', '?', '*'];
        val[1] = e.target.value ? "0/".concat(e.target.value) : val[1];
        this.props.onChange(val);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var translateFn = this.props.translate;
      var value = this.props.value;

      if (value && value.length > 1) {
        value = value[1].split('/')[1];
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "well"
      }, translateFn('Every'), " ", /*#__PURE__*/React.createElement("input", {
        type: "Number",
        onChange: this.onChange.bind(this),
        value: value,
        min: 1,
        max: 60
      }), " ", translateFn('minute(s)'));
    }
  }]);

  return MinutesCron;
}(Component);

export { MinutesCron as default };