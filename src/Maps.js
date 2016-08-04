import React from 'react';
import { withRouter } from 'react-router';
import 'whatwg-fetch';
import sortByOrder from 'lodash.sortbyorder'
import { removeChildren, capitalizeFirstLetters, getMonthYear } from './helpers.js'
window.PouchDB = require('pouchdb');

class Maps extends React.Component {
  constructor() {
    super();

    // TODO, temp state will be wired up with the dropdown menu
    this.state = {
      selectedMonth: '2016-06',
      selectedFlat:'3 ROOM'
    };
    this.db = window.PouchDB('resale') || new window.PouchDB('hdbresale');

  }

  plotHeatmap (month, flat) {
    this.db.get(month)
      .then(doc => {
        this.renderData(doc)
        if (doc.lastUpdate < window.meta.lastUpdate) {
          this.getData(month).then(dataPoints => {
            doc.dataPoints = dataPoints
            doc.lastUpdate = window.meta.lastUpdate
            this.db.put(doc)
              .then(console.log.bind(console))
              .catch(console.error.bind(console))
            this.renderData(doc)
          })
        }
      })
      .catch(() => {
        this.heatmap.setData([])
        //this.loadingScreen.className = 'fa fa-spinner fa-pulse'
        //this.mapDiv.classList.add('chart-loading')
        this.getData(month).then(dataPoints => {
          const doc = {
            '_id': month,
            'lastUpdate': window.meta.lastUpdate,
            'dataPoints': dataPoints
          }
          this.db.put(doc)
            .then(console.log.bind(console))
            .catch(console.error.bind(console))
          this.renderData(doc)
        })
      })
  }

  getData (month) {
    console.log('retrieving data from MongoDB', month);
    const url = window.location.protocol + '//' + window.location.host + '/heatmap?month=' + month
    const headers = { Accept: 'application/json' }
    return window.fetch(url, headers).then(res => res.json()).then(results => {
      let dataPoints = {}
      for (let result of results) {
        result.dataPoints.forEach(pt => { pt.weight = Math.pow(pt.weight, 1.5) })
        dataPoints[result.flat_type] = result.dataPoints
      }
      return dataPoints
    })
  }

  renderData (dataObj) {
    if (dataObj._id !== this.state.selectedMonth) {
      console.warn('overlapping queries')
      return
    }

    let dataPoints = []
    if (this.state.selectedFlat !== 'ALL') {
      dataPoints = dataObj.dataPoints[this.state.selectedFlat];
    } else {
      for (let flat in dataObj.dataPoints) {
        dataPoints = dataPoints.concat(dataObj.dataPoints[flat])
      }
    }
    if (dataPoints.length === 0) {
      console.warn('no data')
      return
    }

    const ticks = dataPoints.map(tick => ({
      location: new google.maps.LatLng(tick.lat, tick.lng),
      weight: tick.weight
    }))
    //this.loadingScreen.className = 'fa'
    //this.mapDiv.classList.remove('chart-loading')
    this.heatmap.setData(ticks)
  }

  resetMap () {
    this.map.setCenter(mapCenter)
    this.map.setZoom(11)
  }

  listAllTransactions (lat, lng, month, flat_type) {
    const url = window.location.protocol + '//' + window.location.host + '/nearby'
    window.fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({lat, lng, radius: 500})
    }).then(res => res.json()).then(json => {
      if (!json.length) {
        removeChildren(this.chartDetail)
        console.log('No result around selected location')
        return
      }

      const resID = [
        '8c00bf08-9124-479e-aeca-7cc411d884c4',
        '83b2fc37-ce8c-4df4-968b-370fd818138b'
      ]
      const resource =
        month < '2012-03' ? resID[0] : resID[1]
      Promise.all(json.map(street_name => {
        const filters = {street_name, month}
        if (flat_type !== 'ALL') Object.assign(filters, {flat_type})
        const dataURL = 'https://data.gov.sg/api/action/datastore_search?resource_id=' +
          resource + '&filters=' + JSON.stringify(filters)
        return window.fetch(dataURL, { Accept: 'application/json' })
          .then(data => data.json())
      }))
      .then(results => results.reduce((records, res) => {
        if (res.result && res.result.records) {
          return records.concat(res.result.records)
        } else {
          return records
        }
      }, []))
      .then(records => {
        if (!json.length) {
          removeChildren(this.chartDetail)
          console.log('No result around selected location')
          return
        }
        this.chartDetail = document.getElementById('chart-detail')
        const table = document.createElement('table')

        const tableTitle = document.createElement('h2')
        tableTitle.id = 'chart-detail-title'
        tableTitle.innerHTML =
          'Transactions Records in ' + getMonthYear(month) + ' around selected location'
        const thead = document.createElement('thead')
        const tr = document.createElement('tr')
        const headers = [
          '#',
          'Block',
          'Street Name',
          'Flat Type',
          'Storey Range',
          'Lease Commence',
          'Floor Area (sqm)',
          'Resale Price (SGD)'
        ]

        headers.forEach(header => {
          const th = document.createElement('th')
          th.textContent = header
          tr.appendChild(th)
        })
        thead.appendChild(tr)
        table.appendChild(thead)
        const tbody = document.createElement('tbody')
        tbody.setAttribute('id', 'table-body')
        sortByOrder(records, record => +record.resale_price, 'desc')
          .forEach((transaction, index) => {
            const row = document.createElement('tr')
            row.classList.add('table-striped')
            let rowData = [
              index + 1,
              transaction.block.trim(),
              capitalizeFirstLetters(transaction.street_name.trim()),
              transaction.flat_type.trim(),
              transaction.storey_range.trim().toLowerCase(),
              transaction.lease_commence_date,
              transaction.floor_area_sqm,
              (+transaction.resale_price).toLocaleString()
            ]
            rowData.map(data => {
              const td = document.createElement('td')
              td.textContent = data
              return td
            }).forEach(td => row.appendChild(td))
            tbody.appendChild(row)
          })
        table.appendChild(tbody)

        removeChildren(this.chartDetail)

        this.chartDetail.appendChild(tableTitle)
        this.chartDetail.appendChild(table)

        document.getElementById('chart-detail-title').scrollIntoView()
      })
    })
  }

  componentDidMount() {
    this.mapCenter = new window.google.maps.LatLng(1.352083, 103.819836);
    this.map = new window.google.maps.Map(this.refs.map, {
      center: this.mapCenter,
      zoom: 11,
      draggableCursor: 'pointer',
      scrollwheel: false
    });

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      radius: 7
    });

    this.plotHeatmap(this.state.selectedMonth, this.state.selectedFlat);

    this.heatmap.setMap(this.map);
  }

  render() {
    return (
      <main>
        <h1 className="chart-title">Property Hotspots in </h1>
        <div className="chart-container">
          <div id="map" ref="map"></div>
        </div>
        <div className="chart-detail"></div>
      </main>
    );
  }
}


export default Maps;