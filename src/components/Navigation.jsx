import React from 'react';
import { Link } from 'react-router';
import { serialize } from './helpers';

function createPath (view, param, query) {
  let path = '/' + view;
  if (param) path += '/' + param;
  if (query[1]) path += `?${query[0]}=${query[1]}`;
  return path;
}

export default class Navigation extends React.Component {
  render () {
    const chartPath = createPath('charts', serialize(this.props.selectedTown),
      ['chart', serialize(this.props.selectedChartType)]);
    const mapPath = createPath('maps', serialize(this.props.selectedMonth),
      ['flat', serialize(this.props.selectedFlatType)]);

    return (
      <header className='header'>
        <ul className='navlist'>
          <li><Link to={chartPath}>Charts</Link></li>
          <li><Link to={mapPath}>Maps</Link></li>
          <li><Link to='/about'>About</Link></li>
        </ul>
        {this.props.selector}
      </header>
    );
  }
}

Navigation.propType = {
  selectedTown: React.PropTypes.string,
  selectedMonth: React.PropTypes.string,
  selectedChartType: React.PropTypes.string,
  selectedFlatType: React.PropTypes.string,
  selector: React.PropTypes.element
};
