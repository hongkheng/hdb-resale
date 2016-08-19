import React from 'react';
import { getMonthYear } from './helpers';

function parseDate (date) {
  return date ? date.slice(8, 10) + ' ' + getMonthYear(date) : '';
}

export default class Footer extends React.Component {
  render () {
    return (
      <footer className='footer'>
        <div className='footer-text'>
          Data retrieved <span className='retrieve-date'>{parseDate(this.props.retrieveDate)}</span> from <a href='https://data.gov.sg/dataset/resale-flat-prices'>data.gov.sg</a>.
        </div>
        <div className='footer-text'>
          Developed by <a href='https://github.com/yongjun21'>Thong Yong Jun</a> &amp; <a href='https://github.com/caalberts'>Albert Salim</a>.
        </div>
        <div className='footer-text'>
          <a className='footer-terms' href='#' onClick={this.props.handleAccept}>Terms of Use</a>
        </div>
      </footer>
    );
  }
}

Footer.propType = {
  retrieveDate: React.PropTypes.object,
  handleAccept: React.PropTypes.function
};
