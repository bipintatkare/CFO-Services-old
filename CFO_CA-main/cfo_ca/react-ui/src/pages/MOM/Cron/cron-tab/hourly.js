import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';
import Minutes from '../minutes-select';
import Hour from '../hour-select';

var HourlyCron = /*#__PURE__*/function (_Component) {
  _inherits(HourlyCron, _Component);

  var _super = _createSuper(HourlyCron);

  function HourlyCron(props) {
    var _this;

    _classCallCheck(this, HourlyCron);

    _this = _super.call(this, props);
    _this.state = {
      every: false
    };
    _this.onHourChange = _this.onHourChange.bind(_assertThisInitialized(_this));
    _this.onAtHourChange = _this.onAtHourChange.bind(_assertThisInitialized(_this));
    _this.onAtMinuteChange = _this.onAtMinuteChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(HourlyCron, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.state.value = this.props.value;

      if (this.state.value[2].split('/')[1] || this.state.value[2] === '*') {
        this.state.every = true;
      }
    }
  }, {
    key: "onHourChange",
    value: function onHourChange(e) {
      if (this.state.every && (e.target.value > 0 && e.target.value < 24 || e.target.value === '')) {
        var val = ['0', '0', '*', '*', '*', '?', '*'];
        val[2] = e.target.value ? "0/".concat(e.target.value) : e.target.value;
        val[3] = '1/1';
        this.props.onChange(val);
      }
    }
  }, {
    key: "onAtHourChange",
    value: function onAtHourChange(e) {
      var val = ['0', this.state.value[1], '*', '1/1', '*', '?', '*'];
      val[2] = "".concat(e.target.value);
      this.props.onChange(val);
    }
  }, {
    key: "onAtMinuteChange",
    value: function onAtMinuteChange(e) {
      var val = ['0', '*', this.state.value[2], '1/1', '*', '?', '*'];
      val[1] = "".concat(e.target.value);
      this.props.onChange(val);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var translateFn = this.props.translate;
      this.state.value = this.props.value;
      return /*#__PURE__*/React.createElement("div", {
        className: "tab-content"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tab-pane active"
      }, /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        onChange: function onChange(e) {
          _this2.setState({
            every: true
          });

          _this2.props.onChange(['0', '0', '0/1', '1/1', '*', '?', '*']);
        },
        checked: this.state.every
      }), /*#__PURE__*/React.createElement("span", null, translateFn('Every'), " "), /*#__PURE__*/React.createElement("input", {
        disabled: !this.state.every,
        type: "Number",
        onChange: this.onHourChange,
        value: this.state.value[2].split('/')[1] ? this.state.value[2].split('/')[1] : ''
      }), /*#__PURE__*/React.createElement("span", null, translateFn('hour(s)'))), /*#__PURE__*/React.createElement("div", {
        className: "well df well-small margin-right-0 margin-left-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text_align_right row",
        style: {
          width: '100%'
        }
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        onChange: function onChange(e) {
          _this2.setState({
            every: false
          });

          _this2.props.onChange();
        },
        checked: !this.state.every
      }), /*#__PURE__*/React.createElement("span", {
        className: ""
      }, translateFn('At')), /*#__PURE__*/React.createElement(Hour, {
        disabled: this.state.every,
        onChange: this.onAtHourChange,
        value: this.state.value[2]
      }), /*#__PURE__*/React.createElement(Minutes, {
        disabled: this.state.every,
        onChange: this.onAtMinuteChange,
        value: this.state.value[1]
      })))));
    }
  }]);

  return HourlyCron;
}(Component);

export { HourlyCron as default };