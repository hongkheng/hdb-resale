import React from 'react';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Footer';
  }
  render() {
    return (
      <footer>
        <div className="footer-text">
        Data retrieved <span className="retrieve-date"></span> from <a href="https://data.gov.sg/dataset/resale-flat-prices">data.gov.sg</a>.
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

export default Footer;
