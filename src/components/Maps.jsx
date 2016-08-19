import React from 'react';
import 'whatwg-fetch';
import IconButton from './IconButton';
import Loader from './Loader';
import { getMonthYear } from './helpers.js';

export default class Maps extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.plotHeatmap = this.plotHeatmap.bind(this);
    this.renderData = this.renderData.bind(this);
    this.resetMap = this.resetMap.bind(this);

  }

  plotHeatmap (month, flatType) {
    this.props.db.get(month)
    .then(doc => {
      this.renderData(doc, month, flatType);
      if (doc.lastUpdate < this.props.lastUpdate) {
        this.getData(month).then(dataPoints => {
          doc.dataPoints = dataPoints;
          doc.lastUpdate = this.props.lastUpdate;
          this.props.db.put(doc)
            .then(console.log.bind(console))
            .catch(console.error.bind(console));
          this.renderData(doc, month, flatType);
        });
      }
    })
    .catch(() => {
      this.heatmap.setData([]);
      this.setState({
        isLoading: true
      });
      this.getData(month).then(dataPoints => {
        const doc = {
          '_id': month,
          'lastUpdate': this.props.lastUpdate,
          'dataPoints': dataPoints
        };
        this.props.db.put(doc)
          .then(console.log.bind(console))
          .catch(console.error.bind(console));
        this.renderData(doc, month, flatType);
      });
    });
  }

  getData (month) {
    console.log('retrieving data from MongoDB', month);
    const url = window.location.protocol + '//' + window.location.host + '/heatmap?month=' + month;
    const headers = { Accept: 'application/json' };
    return window.fetch(url, headers).then(res => res.json()).then(results => {
      let dataPoints = {};
      for (let result of results) {
        result.dataPoints.forEach(pt => {
          pt.weight = Math.pow(pt.weight, 1.5);
        });
        dataPoints[result.flat_type] = result.dataPoints;
      }
      return dataPoints;
    });
  }

  renderData (dataObj, month, flatType) {
    if (dataObj._id !== month) {
      console.warn('overlapping queries');
      return;
    }

    let dataPoints = [];
    if (flatType !== 'ALL') {
      dataPoints = dataObj.dataPoints[flatType];
    } else {
      for (let ft in dataObj.dataPoints) {
        dataPoints = dataPoints.concat(dataObj.dataPoints[ft]);
      }
    }
    if (dataPoints.length === 0) {
      console.warn('no data');
      return;
    }

    const ticks = dataPoints.map(tick => ({
      location: new google.maps.LatLng(tick.lat, tick.lng),
      weight: tick.weight
    }));
    // this.loadingScreen.className = 'fa'
    // this.mapDiv.classList.remove('chart-loading')
    this.setState({
      isLoading: false
    });
    this.heatmap.setData(ticks);
  }

  resetMap () {
    this.map.setCenter(this.mapCenter);
    this.map.setZoom(11);
  }

  // listAllTransactions (lat, lng, month, flat_type) {
  //   const url = window.location.protocol + '//' + window.location.host + '/nearby'
  //   window.fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({lat, lng, radius: 500})
  //   }).then(res => res.json()).then(json => {
  //     if (!json.length) {
  //       removeChildren(this.chartDetail)
  //       console.log('No result around selected location')
  //       return
  //     }
  //
  //     const resID = [
  //       '8c00bf08-9124-479e-aeca-7cc411d884c4',
  //       '83b2fc37-ce8c-4df4-968b-370fd818138b'
  //     ]
  //     const resource =
  //       month < '2012-03' ? resID[0] : resID[1]
  //     Promise.all(json.map(street_name => {
  //       const filters = {street_name, month}
  //       if (flat_type !== 'ALL') Object.assign(filters, {flat_type})
  //       const dataURL = 'https://data.gov.sg/api/action/datastore_search?resource_id=' +
  //         resource + '&filters=' + JSON.stringify(filters)
  //       return window.fetch(dataURL, { Accept: 'application/json' })
  //         .then(data => data.json())
  //     }))
  //     .then(results => results.reduce((records, res) => {
  //       if (res.result && res.result.records) {
  //         return records.concat(res.result.records)
  //       } else {
  //         return records
  //       }
  //     }, []))
  //     .then(records => {
  //       if (!json.length) {
  //         removeChildren(this.chartDetail)
  //         console.log('No result around selected location')
  //         return
  //       }
  //       this.chartDetail = document.getElementById('chart-detail')
  //       const table = document.createElement('table')
  //
  //       const tableTitle = document.createElement('h2')
  //       tableTitle.id = 'chart-detail-title'
  //       tableTitle.innerHTML =
  //         'Transactions Records in ' + getMonthYear(month) + ' around selected location'
  //       const thead = document.createElement('thead')
  //       const tr = document.createElement('tr')
  //       const headers = [
  //         '#',
  //         'Block',
  //         'Street Name',
  //         'Flat Type',
  //         'Storey Range',
  //         'Lease Commence',
  //         'Floor Area (sqm)',
  //         'Resale Price (SGD)'
  //       ]
  //
  //       headers.forEach(header => {
  //         const th = document.createElement('th')
  //         th.textContent = header
  //         tr.appendChild(th)
  //       })
  //       thead.appendChild(tr)
  //       table.appendChild(thead)
  //       const tbody = document.createElement('tbody')
  //       tbody.setAttribute('id', 'table-body')
  //       sortByOrder(records, record => +record.resale_price, 'desc')
  //         .forEach((transaction, index) => {
  //           const row = document.createElement('tr')
  //           row.classList.add('table-striped')
  //           let rowData = [
  //             index + 1,
  //             transaction.block.trim(),
  //             capitalizeFirstLetters(transaction.street_name.trim()),
  //             transaction.flat_type.trim(),
  //             transaction.storey_range.trim().toLowerCase(),
  //             transaction.lease_commence_date,
  //             transaction.floor_area_sqm,
  //             (+transaction.resale_price).toLocaleString()
  //           ]
  //           rowData.map(data => {
  //             const td = document.createElement('td')
  //             td.textContent = data
  //             return td
  //           }).forEach(td => row.appendChild(td))
  //           tbody.appendChild(row)
  //         })
  //       table.appendChild(tbody)
  //
  //       removeChildren(this.chartDetail)
  //
  //       this.chartDetail.appendChild(tableTitle)
  //       this.chartDetail.appendChild(table)
  //
  //       document.getElementById('chart-detail-title').scrollIntoView()
  //     })
  //   })
  // }

  componentDidMount () {
    window.googleMapsLoaded.then(() => {
      this.mapCenter = new google.maps.LatLng(1.352083, 103.819836);
      this.map = new google.maps.Map(this.refs.map, {
        center: this.mapCenter,
        zoom: 11,
        draggableCursor: 'crosshair',
        scrollwheel: false
      });

      this.heatmap = new google.maps.visualization.HeatmapLayer({
        radius: 7
      });
      this.heatmap.setMap(this.map);

      this.plotHeatmap(this.props.selectedMonth, this.props.selectedFlatType);
    });
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedMonth === nextProps.selectedMonth &&
      this.props.selectedFlatType === nextProps.selectedFlatType) return;
    this.plotHeatmap(nextProps.selectedMonth, nextProps.selectedFlatType);
  }

  render () {
    return (
      <main>
        <h1 className='chart-title'>
          Property Hotspots in {getMonthYear(this.props.selectedMonth)}
        </h1>
        <div className='chart-container'>
          <div id='map' ref='map'></div>
          <Loader hidden={!this.state.isLoading}></Loader>
          <IconButton id='reset-map' icon='fa-crosshairs' handleClick={this.resetMap}></IconButton>
          <IconButton id='prev-month' icon='fa-angle-left' handleClick={this.prevChart}></IconButton>
          <IconButton id='next-month' icon='fa-angle-right' handleClick={this.nextChart}></IconButton>
        </div>
        <div className='chart-detail'></div>
      </main>
    );
  }
}

Maps.propType = {
  selectedMonth: React.PropTypes.string,
  selectedFlatType: React.PropTypes.string,
  lastUpdate: React.PropTypes.lastUpdate
};
