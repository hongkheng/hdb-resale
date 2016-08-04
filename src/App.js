import React from 'react';
import maincss from './css/style.css';
import { Link } from 'react-router';
import 'whatwg-fetch';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      townList: [],
      chartType: ['Average', 'Min, Max & Median', 'Smoothed'],
    };
    this.loadDataIntoMeta();
  }
  /**
   * Load data from MongDB
   */
  loadDataIntoMeta() {
    console.log('retrieving data from MongoDB');
    const url = window.location.protocol + '//' + window.location.host + '/list';
    const headers = { Accept: 'application/json' };
    window.fetch(url, headers)
      .then(res => res.json())
      .then(meta => {
        window.meta = meta;
        this.setState({townList: meta.townList });
        console.log('meta loaded', window.meta);
        // saving the data to sessionStorage?
        //maybe saving to localstorage
      }).catch(err => {
        // on network error
        console.log(err);
      });
  }

  componentDidMount() {
    console.log('app', this.props);
  }
  render() {
    return (
      <div>
        <header className="header">
          <ul className="navlist">
            <li><Link to="/charts">Charts</Link></li>
            <li><Link to="/maps">Maps</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <div className="listType">
            <p className="dropdown-title">Choose town & chart type</p>
            <DropDownList collection={this.state.townList} name="town-selector"></DropDownList>
          </div>
        </header>
        {this.props.children}
        <footer>
          <div className="footer-text">
          Data retrieved <span className="retrieve-date"></span> from <a href="https://data.gov.sg/dataset/resale-flat-prices">data.gov.sg</a>.
        </div>
          <div className="footer-text">
          Developed by <a href="https://github.com/yongjun21">Thong Yong Jun</a> &amp; <a href="https://github.com/caalberts">Albert Salim</a>.
        </div>
        <div className="footer-text">
          <a className="footer-terms" href="#">Terms of Use</a>
        </div></footer>
      </div>
    );
  }
}

App.propsType = {
  selectedTown: React.PropTypes.string,
  selectedChartType: React.PropTypes.string
};

App.defaultProps = {
  selectedTown: 'Ang Mo Kio',
  selectedChartType: 'Smoothed'
};

// TODO: extract to another file
class ListItem extends React.Component {
  render() {
    return (<option value={this.props.value}>{this.props.value}</option>);
  }
}

class DropDownList extends React.Component {
  render() {
    var listNodes = this.props.collection.map( (item, index) => {
      return (
        <ListItem value={item} key={index}/>
      );
    });
    return (
      <form>
      <select name={this.props.name}>
        {listNodes}
      </select>
      </form>
    );
  }
}

export default App;