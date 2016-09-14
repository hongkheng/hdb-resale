import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import Terms from './Terms';
import { withRouter } from 'react-router';
import { serialize } from './helpers';
import 'whatwg-fetch';

class App extends React.Component {
  constructor () {
    super();
    this.state = {
      db: new window.PouchDB('hdbresale'),
      chartType: ['Average', 'Min, Max & Median', 'Smoothed'],
      flatType: ['ALL', '3 ROOM', '4 ROOM', '5 ROOM'],
      hideTerms: true
    };

    this.updateTown = this.updateTown.bind(this);
    this.updateMonth = this.updateMonth.bind(this);
    this.updateMonth2 = this.updateMonth2.bind(this);
    this.updateChartType = this.updateChartType.bind(this);
    this.updateFlatType = this.updateFlatType.bind(this);
    this.updateFlatType2 = this.updateFlatType2.bind(this);
    this.toggleTerms = this.toggleTerms.bind(this);
    this.acceptTerms = this.acceptTerms.bind(this);
  }

  toggleTerms (evt) {
    this.setState({
      hideTerms: !this.state.hideTerms
    });
  }

  acceptTerms () {
    this.setState({
      hideTerms: true
    });
  }

  getMeta () {
    const meta = JSON.parse(window.sessionStorage.getItem('meta'));
    if (meta) return Promise.resolve(meta);

    console.log('retrieving data from MongoDB in index.js');
    const url = window.location.protocol + '//' + window.location.host + '/list';
    const headers = { Accept: 'application/json' };
    return window.fetch(url, headers).then(res => res.json()).then(meta => {
      window.sessionStorage.setItem('meta', JSON.stringify(meta));
      return meta;
    });
  }

  componentDidMount () {
    this.getMeta()
    .then(meta => {
      console.log('meta loaded', meta);
      const selectedTown = Array.find(meta.townList, t => {
        return serialize(t) === serialize(this.props.params.town);
      }) || meta.townList[0];
      const selectedMonth = Array.find(meta.monthList, m => {
        return serialize(m) === serialize(this.props.params.month);
      }) || meta.monthList[meta.monthList.length - 1];
      const selectedChartType = Array.find(this.state.chartType, c => {
        return serialize(c) === serialize(this.props.location.query.type);
      }) || 'Smoothed';
      const selectedFlatType = Array.find(this.state.flatType, f => {
        return serialize(f) === serialize(this.props.location.query.flat);
      }) || 'ALL';
      this.setState({
        selectedTown,
        selectedMonth,
        selectedChartType,
        selectedFlatType,
        lastUpdate: meta.lastUpdate,
        townList: meta.townList,
        flatList: meta.flatList,
        monthList: meta.monthList
      });
    })
    .catch(console.error.bind(console));
  }

  componentWillReceiveProps (nextProps) {
    const nextState = {};
    const town = Array.find(this.state.townList, t => {
      return serialize(t) === serialize(nextProps.params.town);
    });
    const month = Array.find(this.state.monthList, m => {
      return serialize(m) === serialize(nextProps.params.month);
    });
    const chart = Array.find(this.state.chartType, c => {
      return serialize(c) === serialize(nextProps.location.query.type);
    });
    const flat = Array.find(this.state.flatType, f => {
      return serialize(f) === serialize(nextProps.location.query.flat);
    });
    if (town && town !== this.state.selectedTown) nextState.selectedTown = town;
    if (month && month !== this.state.selectedMonth) nextState.selectedMonth = month;
    if (chart && chart !== this.state.selectedChartType) nextState.selectedChartType = chart;
    if (flat && flat !== this.state.selectedFlatType) nextState.selectedFlatType = flat;
    if (Object.keys(nextState).length > 0) this.setState(nextState);
  }

  updateTown (evt) {
    const selectedTown = evt.target.value;
    if (!selectedTown) return;
    this.props.router.push({
      pathname: '/charts/' + serialize(selectedTown),
      query: {type: serialize(this.state.selectedChartType)}
    });
  }

  updateMonth (evt) {
    const selectedMonth = evt.target.value;
    if (!selectedMonth) return;
    this.props.router.push({
      pathname: '/maps/' + serialize(selectedMonth),
      query: {flat: serialize(this.state.selectedFlatType)}
    });
  }

  updateMonth2 (evt) {
    const selectedMonth = evt.target.value;
    if (!selectedMonth) return;
    this.props.router.push({
      pathname: '/areas/' + serialize(selectedMonth),
      query: {flat: serialize(this.state.selectedFlatType)}
    });
  }

  updateChartType (evt) {
    const selectedChartType = evt.target.value;
    if (!selectedChartType) return;
    this.props.router.push({
      pathname: '/charts/' + serialize(this.state.selectedTown),
      query: {type: serialize(selectedChartType)}
    });
  }

  updateFlatType (evt) {
    const selectedFlatType = evt.target.value;
    if (!selectedFlatType) return;
    this.props.router.push({
      pathname: '/maps/' + serialize(this.state.selectedMonth),
      query: {flat: serialize(selectedFlatType)}
    });
  }

  updateFlatType2 (evt) {
    const selectedFlatType = evt.target.value;
    if (!selectedFlatType) return;
    this.props.router.push({
      pathname: '/areas/' + serialize(this.state.selectedMonth),
      query: {flat: serialize(selectedFlatType)}
    });
  }

  render () {
    const selector = this.state.lastUpdate && (this.props.selector &&
      React.cloneElement(this.props.selector, Object.assign({
        updateTown: this.updateTown,
        updateMonth: this.updateMonth,
        updateMonth2: this.updateMonth2,
        updateChartType: this.updateChartType,
        updateFlatType: this.updateFlatType,
        updateFlatType2: this.updateFlatType2
      }, this.state)));

    const main = this.state.lastUpdate && (this.props.main &&
      React.cloneElement(this.props.main, Object.assign({
        updateMonth: this.updateMonth,
        updateMonth2: this.updateMonth2
      }, this.state)));

    return (
      <div className='container'>
        <Navigation {...this.state} selector={selector} />
        {main}
        <Footer retrieveDate={this.state.lastUpdate} handleAccept={this.toggleTerms} />
        {!this.state.hideTerms && <Terms handleAccept={this.acceptTerms} />}
      </div>
    );
  }
}

export default withRouter(App);
