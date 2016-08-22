import React from 'react';
import 'whatwg-fetch';
import sortByOrder from 'lodash.sortbyorder';
import Table from './Table';
import Loader from './Loader';
import { capitalizeFirstLetters, getMonthYear } from './helpers.js';

export default class Charts extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: false,
      table: {
        title: '',
        colNames: [],
        rows: []
      }
    };

    this.layout = {
      hovermode: 'closest',
      autosize: true,
      height: 500,
      margin: {
        l: 50,
        r: 20,
        t: 50,
        b: 50,
        pad: 10
      }
    };

    if (window.matchMedia('(max-width: 900px)').matches) {
      this.layout.width = 500;
      this.layout.legend = {
        x: 0.08,
        y: 0.92,
        xanchor: 'left',
        yanchor: 'top'
      };
    } else {
      this.layout.width = 700;
      this.layout.legend = {
        y: 0.5,
        yanchor: 'middle'
      };
    }

    this.plotChart = this.plotChart.bind(this);
    this.renderData = this.renderData.bind(this);
    this.listAllTransactions = this.listAllTransactions.bind(this);
  }

  getTitle (town, chartType) {
    if (chartType === 'Smoothed') {
      return 'Historial Trend of HDB Resale Prices in ' + capitalizeFirstLetters(town);
    } else if (chartType === 'Average') {
      return 'Historical Average of HDB Resale Prices in ' + capitalizeFirstLetters(town);
    } else {
      return 'Range of Transacted Prices in ' + capitalizeFirstLetters(town) + ' (Min, Max & Median)';
    }
  }

  plotChart (town, chartType) {
    this.props.db.get(town)
    .then(doc => {
      this.renderData(doc);
      if (doc.lastUpdate < this.props.lastUpdate) {
        this.getData(town).then(datasets => {
          doc['Average'] = datasets[0];
          doc['Min, Max & Median'] = datasets[1];
          doc['Smoothed'] = datasets[2];
          doc.lastUpdate = this.props.lastUpdate;
          this.props.db.put(doc)
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
          this.renderData(doc);
        });
      }
    })
    .catch(() => {
      this.setState({
        isLoading: true
      });
      this.getData(town).then(datasets => {
        const doc = {
          '_id': town,
          'lastUpdate': this.props.lastUpdate,
          'Average': datasets[0],
          'Min, Max & Median': datasets[1],
          'Smoothed': datasets[2]
        };
        this.props.db.put(doc)
          .then(console.log.bind(console))
          .catch(console.error.bind(console));
        this.renderData(doc);
      });
    });
  }

  getData (town) {
    console.log('retrieving data from MongoDB');
    const url = window.location.protocol + '//' + window.location.host + '/time_series?town=' + town;
    const headers = {Accept: 'application/json'};
    return window.fetch(url, headers).then(res => res.json()).then(results => {
      function prepareData (chartType) {
        const datasets = [];
        const datasetsReserve = [];
        sortByOrder(results, result => result.flat_type, 'desc').forEach(result => {
          if (result.time_series.month.length > 0) {
            if (chartType === 'Smoothed' && result.time_series.month.length > 100) {
              const fillx = [];
              const filly = [];
              for (let i = 0; i < result.time_series.month.length; i++) {
                fillx.push(result.time_series.month[i]);
                filly.push(result.time_series.loess[i] + result.time_series.loessError[i]);
              }
              for (let i = result.time_series.month.length - 1; i > -1; i--) {
                fillx.push(result.time_series.month[i]);
                filly.push(result.time_series.loess[i]);
              }
              for (let i = 0; i < result.time_series.month.length; i++) {
                fillx.push(result.time_series.month[i]);
                filly.push(result.time_series.loess[i]);
              }
              for (let i = result.time_series.month.length - 1; i > -1; i--) {
                fillx.push(result.time_series.month[i]);
                filly.push(result.time_series.loess[i] - result.time_series.loessError[i]);
              }
              const dataset = {
                name: result.flat_type,
                x: fillx,
                y: filly,
                type: 'scatter',
                line: {width: 1},
                fill: 'tozeroy'
              };
              datasets.push(dataset);
              const secondaryDataset = {
                x: result.time_series.month,
                y: result.time_series.median,
                type: 'scatter',
                mode: 'markers',
                marker: {
                  size: 1.5,
                  color: 'black'
                },
                hoverinfo: 'none',
                showlegend: false
              };
              datasetsReserve.push(secondaryDataset);
            } else {
              const dataset = {
                name: result.flat_type,
                x: result.time_series.month,
                error_y: {
                  type: 'data',
                  visible: true,
                  thickness: 1,
                  width: 0
                },
                type: 'scatter',
                mode: 'markers',
                marker: {
                  size: 3
                }
              };
              if (chartType === 'Average') {
                dataset.y = result.time_series.mean;
                dataset.error_y.array = result.time_series.std;
              } else {
                dataset.y = result.time_series.median;
                dataset.error_y.symmetric = false;
                dataset.error_y.array = result.time_series.max;
                dataset.error_y.arrayminus = result.time_series.min;
              }
              datasets.push(dataset);
            }
          }
        });
        return datasets.concat(datasetsReserve);
      }
      return [prepareData('Average'), prepareData('Min, Max & Median'), prepareData('Smoothed')];
    });
  }

  renderData (dataObj) {
    if (dataObj._id !== this.props.selectedTown) console.warn('overlapping queries');
    else {
      Plotly.newPlot(this.refs.plotContainer, dataObj[this.props.selectedChartType], this.layout);
      this.refs.plotContainer.on('plotly_click', click => {
        if (!click.points[0].data.name) return;
        this.listAllTransactions(this.props.selectedTown, click.points[0].data.name, click.points[0].x);
      });
      this.setState({
        isLoading: false
      });
    }
  }

  listAllTransactions (town, flat_type, date) { // eslint-disable-line
    const resID = [
      '8c00bf08-9124-479e-aeca-7cc411d884c4',
      '83b2fc37-ce8c-4df4-968b-370fd818138b'
    ];
    const month = date.slice(0, 7);
    const resource = month < '2012-03' ? resID[0] : resID[1];
    const filters = {town, flat_type, month};
    const dataURL = 'https://data.gov.sg/api/action/datastore_search?resource_id=' +
      resource + '&filters=' + JSON.stringify(filters);

    window.fetch(dataURL, { Accept: 'application/json' })
      .then(data => data.json())
      .then(json => {
        console.log(json);
        const title =
          'Transactions Records for ' + capitalizeFirstLetters(flat_type) +
          ' Flats <span>in ' + capitalizeFirstLetters(town) +
          ' in ' + getMonthYear(date) + '</span>';
        const colNames = [
          '#',
          'Block',
          'Street Name',
          'Storey Range',
          'Lease Commence',
          'Floor Area (sqm)',
          'Resale Price (SGD)'
        ];

        const transactions = sortByOrder(json.result.records,
          record => +record.resale_price, 'desc');
        const rows = transactions.map((transaction, index) => ([
          index + 1,
          transaction.block.trim(),
          capitalizeFirstLetters(transaction.street_name.trim()),
          transaction.storey_range.trim().toLowerCase(),
          transaction.lease_commence_date,
          transaction.floor_area_sqm,
          (+transaction.resale_price).toLocaleString()
        ]));

        this.setState({
          table: {title, colNames, rows}
        });
      });
  }

  componentDidMount () {
    this.plotChart(this.props.selectedTown, this.props.selectedChartType);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedTown === nextProps.selectedTown &&
      this.props.selectedChartType === nextProps.selectedChartType) return;
    this.setState({
      table: {
        title: '',
        colNames: [],
        rows: []
      }
    });
    this.plotChart(nextProps.selectedTown, nextProps.selectedChartType);
  }

  render () {
    return (
      <main>
        <h1 className='chart-title'>
          {this.getTitle(this.props.selectedTown, this.props.selectedChartType)}
        </h1>
        <div className='chart-container'>
          <div ref='plotContainer' className='js-plotly-plot' />
          <Loader hidden={!this.state.isLoading} />
        </div>
        <Table {...this.state.table} />
      </main>
      );
  }

}

Charts.propType = {
  selectedTown: React.PropTypes.string,
  selectedChartType: React.PropTypes.string,
  lastUpdate: React.PropTypes.lastUpdate
};
