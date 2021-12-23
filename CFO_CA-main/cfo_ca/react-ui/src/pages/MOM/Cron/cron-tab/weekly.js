import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { Component } from 'react';
import Minutes from '../minutes-select';
import Hour from '../hour-select';

var WeeklyCron = /*#__PURE__*/function (_Component) {
  _inherits(WeeklyCron, _Component);

  var _super = _createSuper(WeeklyCron);

  function WeeklyCron(props) {
    var _this;

    _classCallCheck(this, WeeklyCron);

    _this = _super.call(this, props);
    _this.state = {};
    _this.onAtHourChange = _this.onAtHourChange.bind(_assertThisInitialized(_this));
    _this.onAtMinuteChange = _this.onAtMinuteChange.bind(_assertThisInitialized(_this));
    _this.onCheck = _this.onCheck.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WeeklyCron, [{
    key: "onAtHourChange",
    value: function onAtHourChange(e) {
      var val = this.state.value;
      val[0] = '0';
      val[2] = "".concat(e.target.value);
      this.props.onChange(val);
    }
  }, {
    key: "onAtMinuteChange",
    value: function onAtMinuteChange(e) {
      var val = this.state.value;
      val[0] = '0';
      val[1] = "".concat(e.target.value);
      this.props.onChange(val);
    }
  }, {
    key: "onCheck",
    value: function onCheck(e) {
      var val = this.state.value;
      val[0] = '0';

      if (e.target.checked) {
        this.onDayChecked(val, e);
      } else {
        this.onDayUnChecked(val, e);
      }

      this.props.onChange(val);
    }
  }, {
    key: "onDayChecked",
    value: function onDayChecked(val, e) {
      val[2] = "".concat(val[2]).split('/').length > 1 ? '0' : val[2].toString();
      val[3] = '?';
      val[4] = '*';

      if (val[5] === '*' || val[5] === '?' || val[5] === 'MON-FRI') {
        val[5] = e.target.value;
      } else {
        val[5] = val[5] + '!' + e.target.value;
      }
    }
  }, {
    key: "onDayUnChecked",
    value: function onDayUnChecked(val, e) {
      val[5] = val[5].split('!');

      if (val[5].length > 1) {
        val[5].splice(val[5].indexOf(e.target.value), 1);
        val[5] = val[5].toString().replace(/,/g, '!');
      } else {
        val[5] = '*';
      }
    }
  }, {
    key: "render",
    value: function render() {
      var translateFn = this.props.translate;
      this.state.value = this.props.value;
      return /*#__PURE__*/React.createElement("div", {
        className: "container-fluid"
      }, /*#__PURE__*/React.createElement("div", {
        className: "well well-small row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "span6 col-sm-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text_align_left"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "MON",
        onChange: this.onCheck,
        checked: this.state.value[5].search('MON') !== -1 ? true : false
      }), translateFn('Monday'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "WED",
        onChange: this.onCheck,
        checked: this.state.value[5].search('WED') !== -1 ? true : false
      }), translateFn('Wednesday'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "FRI",
        onChange: this.onCheck,
        checked: this.state.value[5].search('FRI') !== -1 ? true : false
      }), translateFn('Friday'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "SUN",
        onChange: this.onCheck,
        checked: this.state.value[5].search('SUN') !== -1 ? true : false
      }), translateFn('Sunday'))), /*#__PURE__*/React.createElement("div", {
        className: "span6 col-sm-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text_align_left"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "TUE",
        onChange: this.onCheck,
        checked: this.state.value[5].search('TUE') !== -1 ? true : false
      }), translateFn('Tuesday'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "THU",
        onChange: this.onCheck,
        checked: this.state.value[5].search('THU') !== -1 ? true : false
      }), translateFn('Thursday'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: "SAT",
        onChange: this.onCheck,
        checked: this.state.value[5].search('SAT') !== -1 ? true : false
      }), translateFn('Saturday')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null))), translateFn('Start time'), /*#__PURE__*/React.createElement(Hour, {
        onChange: this.onAtHourChange,
        value: this.state.value[2]
      }), /*#__PURE__*/React.createElement(Minutes, {
        onChange: this.onAtMinuteChange,
        value: this.state.value[1]
      }));
    }
  }]);

  return WeeklyCron;
}(Component);

export { WeeklyCron as default };