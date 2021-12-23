import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';

var YearlyCron = /*#__PURE__*/function (_Component) {
  _inherits(YearlyCron, _Component);

  var _super = _createSuper(YearlyCron);

  function YearlyCron(props) {
    var _this;

    _classCallCheck(this, YearlyCron);

    _this = _super.call(this, props);
    _this.state = {};
    return _this;
  }

  _createClass(YearlyCron, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, "yearly");
    }
  }]);

  return YearlyCron;
}(Component);

export { YearlyCron as default };