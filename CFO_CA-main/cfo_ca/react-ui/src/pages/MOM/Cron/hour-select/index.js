import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';

var Hour = /*#__PURE__*/function (_Component) {
  _inherits(Hour, _Component);

  var _super = _createSuper(Hour);

  function Hour() {
    _classCallCheck(this, Hour);

    return _super.apply(this, arguments);
  }

  _createClass(Hour, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("select", {
        disabled: this.props.disabled === true ? true : false,
        className: "hours",
        onChange: this.props.onChange ? this.props.onChange : function () {},
        value: this.props.value
      }, this.buildOptions());
    }
  }, {
    key: "buildOptions",
    value: function buildOptions() {
      var options = [];

      for (var i = 0; i < 24; i++) {
        options.push( /*#__PURE__*/React.createElement("option", {
          key: i,
          id: i
        }, (i < 10 ? '0' : '') + i));
      }

      return options;
    }
  }]);

  return Hour;
}(Component);

export { Hour as default };