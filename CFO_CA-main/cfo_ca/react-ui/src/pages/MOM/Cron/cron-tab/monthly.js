import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import Minutes from '../minutes-select';
import Hour from '../hour-select';

var MonthlyCron = /*#__PURE__*/function (_Component) {
  _inherits(MonthlyCron, _Component);

  var _super = _createSuper(MonthlyCron);

  function MonthlyCron(props) {
    var _this;

    _classCallCheck(this, MonthlyCron);

    _this = _super.call(this, props);
    _this.state = {
      hour: 0,
      minute: 0
    };
    _this.onDayChange = _this.onDayChange.bind(_assertThisInitialized(_this));
    _this.onLastDayChange = _this.onLastDayChange.bind(_assertThisInitialized(_this));
    _this.onAtHourChange = _this.onAtHourChange.bind(_assertThisInitialized(_this));
    _this.onAtMinuteChange = _this.onAtMinuteChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MonthlyCron, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.state.value = this.props.value;

      if (this.state.value[3] === 'L') {
        this.state.every = "2";
      } else if (this.state.value[3] === 'LW') {
        this.state.every = "3";
      } else if (this.state.value[3].startsWith('L')) {
        this.state.every = "4";
      } else {
        this.state.every = "1";
      }
    }
  }, {
    key: "onDayChange",
    value: function onDayChange(e) {
      if (parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 31 || e.target.value === "") {
        var val = ['0', this.state.value[1] === '*' ? '0' : this.state.value[1], this.state.value[2] === '*' ? '0' : this.state.value[2], this.state.value[3], '1/1', '?', '*'];
        val[3] = "".concat(e.target.value);
        this.props.onChange(val);
      }
    }
  }, {
    key: "onLastDayChange",
    value: function onLastDayChange(e) {
      if (parseInt(e.target.value) >> 0 && parseInt(e.target.value) <= 31 || e.target.value === "") {
        var val = ['0', this.state.value[1] === '*' ? '0' : this.state.value[1], this.state.value[2] === '*' ? '0' : this.state.value[2], this.state.value[3], '1/1', '?', '*'];

        if (e.target.value === '') {
          val[3] = '';
        } else {
          val[3] = "L-".concat(e.target.value);
        }

        this.props.onChange(val);
      }
    }
  }, {
    key: "onAtHourChange",
    value: function onAtHourChange(e) {
      var val = this.state.value;
      val[2] = "".concat(e.target.value);
      this.props.onChange(val);
    }
  }, {
    key: "onAtMinuteChange",
    value: function onAtMinuteChange(e) {
      var val = this.state.value;
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
        className: "tab-pane"
      }, /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        onChange: function onChange(e) {
          _this2.setState({
            every: e.target.value
          });

          _this2.props.onChange(['0', _this2.state.value[1] === '*' ? '0' : _this2.state.value[1], _this2.state.value[2] === '*' ? '0' : _this2.state.value[2], '1', '1/1', '?', '*']);
        },
        value: "1",
        name: "MonthlyRadio",
        checked: this.state.every === "1" ? true : false
      }), translateFn('Day'), /*#__PURE__*/React.createElement("input", {
        readOnly: this.state.every !== "1",
        type: "number",
        value: this.state.value[3],
        onChange: this.onDayChange
      }), translateFn('of every month(s)')), /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        onChange: function onChange(e) {
          _this2.setState({
            every: e.target.value
          });

          _this2.props.onChange(['0', _this2.state.value[1] === '*' ? '0' : _this2.state.value[1], _this2.state.value[2] === '*' ? '0' : _this2.state.value[2], 'L', '*', '?', '*']);
        },
        type: "radio",
        value: "2",
        name: "DailyRadio",
        checked: this.state.every === "2" ? true : false
      }), translateFn('Last day of every month')), /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        onChange: function onChange(e) {
          _this2.setState({
            every: e.target.value
          });

          _this2.props.onChange(['0', _this2.state.value[1] === '*' ? '0' : _this2.state.value[1], _this2.state.value[2] === '*' ? '0' : _this2.state.value[2], 'LW', '*', '?', '*']);
        },
        type: "radio",
        value: "3",
        name: "DailyRadio",
        checked: this.state.every === "3" ? true : false
      }), translateFn('On the last weekday of every month')), /*#__PURE__*/React.createElement("div", {
        className: "well well-small"
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        onChange: function onChange(e) {
          _this2.setState({
            every: e.target.value
          });

          _this2.props.onChange(['0', _this2.state.value[1] === '*' ? '0' : _this2.state.value[1], _this2.state.value[2] === '*' ? '0' : _this2.state.value[2], "L-".concat(1), '*', '?', '*']);
        },
        value: "4",
        name: "MonthlyRadio",
        checked: this.state.every === "4" ? true : false
      }), /*#__PURE__*/React.createElement("input", {
        readOnly: this.state.every !== "4",
        type: "number",
        value: this.state.value[3].split('-')[1],
        onChange: this.onLastDayChange
      }), translateFn('day(s) before the end of the month')), translateFn('Start time'), /*#__PURE__*/React.createElement(Hour, {
        onChange: this.onAtHourChange,
        value: this.state.value[2]
      }), /*#__PURE__*/React.createElement(Minutes, {
        onChange: this.onAtMinuteChange,
        value: this.state.value[1]
      }));
    }
  }]);

  return MonthlyCron;
}(Component);

export { MonthlyCron as default };