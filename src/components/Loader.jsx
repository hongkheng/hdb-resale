import React from 'react';

export default class Loader extends React.Component {
  render() {
    return (
      <div className='loader-overlay' hidden={this.props.hidden}>
        <i className='loading fa fa-spinner fa-pulse'></i>
      </div>
    );
  }
}

Loader.propType = {
  hidden: React.PropTypes.bool
};
