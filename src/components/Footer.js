import React from 'react';
import { getMonthYear } from './helpers';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  parsedDate(date) {
    return (date) ? date.slice(8, 10) + ' ' + getMonthYear(date) : '';
  }

  render() {
    return (
      <footer>
        <div className="footer-text">
        Data retrieved <span className="retrieve-date">{this.parsedDate(this.props.retrieveDate)}</span> from <a href="https://data.gov.sg/dataset/resale-flat-prices">data.gov.sg</a>.
      </div>
        <div className="footer-text">
        Developed by <a href="https://github.com/yongjun21">Thong Yong Jun</a> &amp; <a href="https://github.com/caalberts">Albert Salim</a>.
      </div>
      <div className="footer-text">
        <a className="footer-terms" href="#">Terms of Use</a>
      </div>
      </footer>

    );
  }
}

Footer.propType = {
  retrieveDate: React.PropTypes.string
};

Footer.defaultProp = {
  retrieveDate: ''
};

export default Footer;
