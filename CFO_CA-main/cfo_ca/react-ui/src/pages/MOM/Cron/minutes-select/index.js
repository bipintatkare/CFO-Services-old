import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';

var Minutes = /*#__PURE__*/function (_Component) {
  _inherits(Minutes, _Component);

  var _super = _createSuper(Minutes);

  function Minutes() {
    _classCallCheck(this, Minutes);

    return _super.apply(this, arguments);
  }

  _createClass(Minutes, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("select", {
        disabled: this.props.disabled === true ? true : false,
        className: "minutes",
        onChange: this.props.onChange ? this.props.onChange : function () {},
        value: this.props.value
      }, this.buildOptions());
    }
  }, {
    key: "buildOptions",
    value: function buildOptions() {
      var options = [];

      for (var i = 0; i < 60; i++) {
        options.push( /*#__PURE__*/React.createElement("option", {
          key: i,
          id: i
        }, (i < 10 ? '0' : '') + i));
      }

      return options;
    }
  }]);

  return Minutes;
}(Component);

export { Minutes as default };