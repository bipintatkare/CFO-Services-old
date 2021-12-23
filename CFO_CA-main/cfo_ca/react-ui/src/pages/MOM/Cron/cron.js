import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";

/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import cronstrue from 'cronstrue/i18n';
import { metadata, loadHeaders } from './meta';
import './cron-builder.css';

var Cron = /*#__PURE__*/function (_Component) {
  _inherits(Cron, _Component);
  
  var _super = _createSuper(Cron);

  function Cron(props) {
    var _this;

    _classCallCheck(this, Cron);

    _this = _super.call(this, props);
    _this.state = {
      headers: loadHeaders(_this.props.options),
      locale: _this.props.locale ? _this.props.locale : 'en'
    };
    return _this;
  }

  _createClass(Cron, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setValue(this.props.value);

      if (this.props.translateFn && !this.props.locale) {
        console.log('Warning !!! locale not set while using translateFn');
      }

      if (this.props.onRef) {
        this.props.onRef(this);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value && this.state.value) {
        var newVal = '';
        newVal = this.state.value.toString().replace(/,/g, ' ');
        newVal = newVal.replace(/!/g, ',');

        if (nextProps.value !== newVal) {
          this.setValue(nextProps.value);
        }
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      var prevState = this.state;
      prevState.value = value;

      if (prevState.value && prevState.value.split(' ').length === 6) {
        prevState.value += ' *';
      }

      if (!prevState.value || prevState.value.split(' ').length !== 7) {
        prevState.value = ['0', '0', '00', '1/1', '*', '?', '*'];
        prevState.selectedTab = prevState.headers[0];
        this.parentChange(prevState.value);
      } else {
        prevState.value = prevState.value.replace(/,/g, '!').split(' ');
      }

      var val = prevState.value;

      if (val[1].search('/') !== -1 && val[2] === '*' && val[3] === '1/1') {
        prevState.selectedTab = prevState.headers[0];
      } else if (val[3] === '1/1') {
        prevState.selectedTab = prevState.headers[1];
      } else if (val[3].search('/') !== -1 || val[5] === 'MON-FRI') {
        prevState.selectedTab = prevState.headers[2];
      } else if (val[3] === '?') {
        prevState.selectedTab = prevState.headers[3];
      } else if (val[3].startsWith('L') || val[4] === '1/1') {
        prevState.selectedTab = prevState.headers[4];
      } else {
        prevState.selectedTab = prevState.headers[0];
      } // this.parentChange(prevState.value)


      this.setState(prevState);
    }
  }, {
    key: "tabChanged",
    value: function tabChanged(tab) {
      var _this2 = this;

      this.setState({
        selectedTab: tab,
        value: this.defaultValue(tab)
      }, function () {
        return _this2.parentChange(_this2.defaultValue(tab));
      });
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      var _this3 = this;

      return this.state.headers.map(function (d, index) {
        return /*#__PURE__*/React.createElement("li", {
          key: index,
          className: _this3.state.selectedTab === d ? 'cronNavactive' : ''
        }, /*#__PURE__*/React.createElement("a", {
          onClick: _this3.tabChanged.bind(_this3, d)
        }, _this3.translate(d)));
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(val) {
      var _this4 = this;

      if (val && val.length) {
        this.setState({
          value: val
        }, function () {
          return _this4.parentChange(val);
        });
      } else {
        val = ['0', '0', '00', '1/1', '*', '?', '*'];
        this.setState({
          value: val
        }, function () {
          return _this4.parentChange(val);
        }); // val = ['0','0','00','1/1','*','?','*'];
      }
    }
  }, {
    key: "parentChange",
    value: function parentChange(val) {
      var newVal = '';
      newVal = val.toString().replace(/,/g, ' ');
      newVal = newVal.replace(/!/g, ',');
      this.props.onChange(newVal);
    }
  }, {
    key: "getVal",
    value: function getVal() {
      var val = cronstrue.toString(this.state.value.toString().replace(/,/g, ' ').replace(/!/g, ','), {
        locale: this.state.locale
      });

      if (val.search('undefined') === -1) {
        return val;
      }

      return '-';
    }
  }, {
    key: "defaultValue",
    value: function defaultValue(tab) {
      var index = this.state.headers.indexOf(tab);

      if (metadata[index] === -1) {
        return;
      }

      return metadata[index].initialCron;
    }
  }, {
    key: "getComponent",
    value: function getComponent(tab) {
      var index = this.state.headers.indexOf(tab);

      if (metadata[index] === -1) {
        return;
      }

      var selectedMetaData = metadata.find(function (data) {
        return data.component.name === tab + 'Cron';
      });

      if (!selectedMetaData) {
        selectedMetaData = metadata[index];
      }

      if (!selectedMetaData) {
        throw new Error('Value does not match any available headers.');
      }

      var CronComponent = selectedMetaData.component;
      return /*#__PURE__*/React.createElement(CronComponent, {
        translate: this.translate.bind(this),
        value: this.state.value,
        onChange: this.onValueChange.bind(this)
      });
    }
  }, {
    key: "translate",
    value: function translate(key) {
      var translatedText = key;

      if (this.props.translateFn) {
        translatedText = this.props.translateFn(key);

        if (typeof translatedText !== 'string') {
          throw new Error('translateFn expects a string translation');
        }
      }

      return translatedText;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "cron_builder"
      },

        /*#__PURE__*/React.createElement("ul", {
        className: "nav nav-tabs"
      }, this.getHeaders()),

        /*#__PURE__*/React.createElement("div", {
        className: "cron_builder_bordering"
      }, this.getComponent(this.state.selectedTab)),

        this.props.showResultText && /*#__PURE__*/React.createElement("div", {
          className: "cron-builder-bg"
        }, this.getVal()),

        this.props.showResultCron && /*#__PURE__*/React.createElement("div", {
          className: "cron-builder-bg"
        }, this.state.value.toString().replace(/,/g, ' ').replace(/!/g, ',')));
    }
  }]);

  return Cron;
}(Component);

export { Cron as default };