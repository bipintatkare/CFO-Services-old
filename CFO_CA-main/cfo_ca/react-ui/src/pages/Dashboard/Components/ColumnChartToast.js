import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { ColumnChart } from "@toast-ui/react-chart";
import TuiChart from 'tui-chart';
import "../../AllCharts/toastui/toastui.scss";

var theme = {
  chart: {
    background: {
        color: '#fff',
        opacity: 0
    },
},
title: {
    color: '#8791af',
},
xAxis: {
    title: {
        color: '#8791af'
    },
    label: {
        color: '#8791af'
    },
    tickColor: '#8791af'
},
yAxis: {
    title: {
        color: '#8791af'
    },
    label: {
        color: '#8791af'
    },
    tickColor: '#8791af'
},
plot: {
    lineColor: 'rgba(166, 176, 207, 0.1)'
},
legend: {
    label: {
        color: '#8791af'
    }
},
series: {
    colors: [
        '#34c38f', '#556ee6', '#f46a6a'
    ]
}
};

class ColumnChartToast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = this.props.data_receipt;

    const options = {
      chart: {
        width: this.props.chartWidth,
        height: 380,
        title: 'Monthly Revenue',
        format: '1,000'
    },
    yAxis: {
        title: 'Amount',
        min: 0,
        max: 11843287000
    },
    xAxis: {
        title: 'Month'
    },
    legend: {
        align: 'top'
    }
    };

    return (
      <React.Fragment>
        <ColumnChart data={data} options={options} />
      </React.Fragment>
    );
  }
}

export default ColumnChartToast;
