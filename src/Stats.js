import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

let chartInstance = null;
export {chartInstance};

class Stats {
  constructor(chartConfig) {
    this._chartTitle = chartConfig.chartTitle;
    this._canvas = chartConfig.canvas;
    this._labels = [];
    this._data = [];
    this._formatter = chartConfig.formatter;
    const {dataset} = chartConfig;
    Object.keys(dataset).forEach((label) => {
      this._labels.push(label);
      this._data.push(dataset[label]);
    });
  }

  render() {
    chartInstance = new Chart(this._canvas, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._labels,
        datasets: [{
          data: this._data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: this._formatter
          }
        },
        title: {
          display: true,
          text: this._chartTitle,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }
}

export default Stats;
