import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import Minutes from '../minutes-select';
import Hour from '../hour-select';

var DailyCron = /*#__PURE__*/function (_Component) {
  _inherits(DailyCron, _Component);

  var _super = _createSuper(DailyCron);

  function DailyCron(props) {
    var _this;

    _classCallCheck(this, DailyCron);

    _this = _super.call(this, props);
    _this.state = {
      hour: 0,
      minute: 0
    };
    _this.onDayChange = _this.onDayChange.bind(_assertThisInitialized(_this));
    _this.onAtHourChange = _this.onAtHourChange.bind(_assertThisInitialized(_this));
    _this.onAtMinuteChange = _this.onAtMinuteChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DailyCron, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.state.value = this.props.value;
      this.state.every = this.props.value[3] !== '?';
    }
  }, {
    key: "onDayChange",
    value: function onDayChange(e) {
      if (!e.target.value || e.target.value > 0 && e.target.value < 32) {
        this.state.value = ['0', this.getValueByIndex(1), this.getValueByIndex(1), '*', '*', '?', '*'];
        this.onValueChange(3, e.target.value ? "1/".concat(e.target.value) : e.target.value);
      }
    }
    /**
     * If value is * return 0 else return value
     * @param {position in array} index 
     */

  }, {
    key: "getValueByIndex",
    value: function getValueByIndex(index) {
      return this.state.value[index] === '*' ? '0' : this.state.value[index];
    }
  }, {
    key: "onAtHourChange",
    value: function onAtHourChange(e) {
      this.onValueChange(2, e.target.value);
    }
  }, {
    key: "onAtMinuteChange",
    value: function onAtMinuteChange(e) {
      this.onValueChange(1, e.target.value);
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(cronPosition, value) {
      var val = this.state.value;
      val[cronPosition] = value;
      this.props.onChange(val);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var translateFn = this.props.translate;
      this.state.value = this.props.value;
      return /*#__PURE__*/React.createElement("div", {
        className: "tab-pane"
      }, /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        onChange: function onChange(e) {
          _this2.setState({
            every: true
          });

          _this2.props.onChange();
        },
        value: "1",
        name: "DailyRadio",
        checked: this.state.every
      }), /*#__PURE__*/React.createElement("span", null, translateFn('Every')), /*#__PURE__*/React.createElement("input", {
        disabled: !this.state.every,
        type: "Number",
        maxLength: "2",
        onChange: this.onDayChange,
        value: this.state.value[3].split('/')[1] ? this.state.value[3].split('/')[1] : ''
      }), /*#__PURE__*/React.createElement("span", null, translateFn('day(s)'))), /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        onChange: function onChange(e) {
          _this2.setState({
            every: false
          });

          _this2.props.onChange(['0', _this2.state.value[1], _this2.state.value[2], '?', '*', 'MON-FRI', '*']);
        },
        type: "radio",
        value: "2",
        name: "DailyRadio",
        checked: !this.state.every
      }), /*#__PURE__*/React.createElement("span", null, translateFn('Every week day'))), /*#__PURE__*/React.createElement("span", null, translateFn('Start time')), /*#__PURE__*/React.createElement(Hour, {
        onChange: this.onAtHourChange,
        value: this.state.value[2]
      }), /*#__PURE__*/React.createElement(Minutes, {
        onChange: this.onAtMinuteChange,
        value: this.state.value[1]
      }));
    }
  }]);

  return DailyCron;
}(Component);

export { DailyCron as default };