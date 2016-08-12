import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import { withRouter } from 'react-router';
import maincss from '../css/style.css';
import { Link } from 'react-router';
import { getMonthYear } from './helpers';
import 'whatwg-fetch';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      meta: {},
      selectedTown: 'ANG MO KIO',
      selectedChartType: 'Smoothed',
      selectedMonth: '2016-06',
      selectedFlat: 'ALL',
      selectedTitle: 'Choose Town & chart type'
    };

    this.updateList1Selection = this.updateList1Selection.bind(this);
    this.updateList2Selection = this.updateList2Selection.bind(this);

  }

  getRetrieveDate(date) {
    return date.slice(8, 10) + ' ' + getMonthYear(date);
  }

  passInList1OnPath(routes) {
    if (routes[1].checkPath === 'charts') {
      return (this.state) ? this.state.meta.townList : [];
    } else if (routes[1].checkPath === 'maps') {
      return (this.state) ? this.state.meta.monthList : [];
    }
  }

  passInList2OnPath(routes) {
    // check for path /charts & /maps
    if (routes[1].checkPath === 'charts') {
      return this.props.chartType;
    } else if (routes[1].checkPath === 'maps') {
      return this.props.flatType;
    }
  }

  passInValueOnPath(routes) {
    if (routes[1].checkPath === 'charts') {
     return this.state.selectedTown;
    } else if (routes[1].checkPath === 'maps') {
      return this.state.selectedMonth;
    }
  }

  passInValue2OnPath(routes) {
    if (routes[1].checkPath === 'charts') {
     return this.state.selectedChartType;
    } else if (routes[1].checkPath === 'maps') {
      return this.state.selectedFlat;
    }
  }
  updateList1Selection(evt) {
    console.log('updateSelection 1', evt.target.value);
    if (this.props.routes[1].checkPath === 'charts') {

      this.setState({
        selectedTown: evt.target.value
      });

      let pathTown = evt.target.value.replace(/\s+|\/+/g, '-').toLowerCase();
      this.props.router.push({
        pathname: '/charts/'+pathTown
      });
    } else if (this.props.routes[1].checkPath === 'maps') {

      this.setState({
        selectedMonth: evt.target.value
      });
      this.props.router.push({
        pathname: '/maps/'+this.state.selectedMonth
      });
    }
  }
  updateList2Selection(evt) {
    console.log('updateSelection 2', evt.target.value);
    if (this.props.routes[1].checkPath === 'charts') {

      this.setState({
        selectedChartType: evt.target.value
      });

    } else if (this.props.routes[1].checkPath === 'maps') {

      this.setState({
        selectedFlat: evt.target.value
      });
    }
  }

  componentWillMount() {
    //console.log('will mount', this.props.location);
  }

  componentDidMount() {
    console.log('retrieving data from MongoDB in index.js');
    const url = window.location.protocol + '//' + window.location.host + '/list';
    const headers = { Accept: 'application/json' };
    window.fetch(url, headers)
      .then(res => res.json())
      .then(meta => {
        window.meta = meta;
        this.setState({ meta: meta})

        console.log('meta loaded', window.meta);
        // saving the data to sessionStorage?
        //maybe saving to localstorage
      }).catch(err => {
        // on network error
        console.log(err);
      });
  }

  render() {
    return (
      <div className="container">
        <Navigation {...this.props} ref="navi"
          list1={this.passInList1OnPath(this.props.routes)}
          list2={this.passInList2OnPath(this.props.routes)}
          selectedList1Value={this.passInValueOnPath(this.props.routes)}
          selectedList2Value={this.passInValue2OnPath(this.props.routes)}
          handleList1Change={this.updateList1Selection}
          handleList2Change={this.updateList2Selection}>
          </Navigation>
        {this.state.meta ? (this.props.children && React.cloneElement(this.props.children, {
          selectedTown: this.state.selectedTown,
          selectedChartType: this.state.selectedChartType
        })) : null }
        <Footer {...this.props} ></Footer>
      </div>
    );
  }
}

App.propsType = {
  townList: React.PropTypes.array,
  chartType: React.PropTypes.array,
  flatType: React.PropTypes.array
};

App.defaultProps = {
  townList: [],
  chartType: ['Average', 'Min, Max & Median', 'Smoothed'],
  flatType: ['ALL', '3 ROOM', '4 ROOM', '5 ROOM']
};

export default withRouter(App);