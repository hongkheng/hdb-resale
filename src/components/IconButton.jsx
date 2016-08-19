import React from 'react';

export default class IconButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button id={this.props.id} className='button'>
        <i aria-hidden='true' className={`fa ${this.props.icon}`} onClick={this.props.handleClick}></i>
      </button>
    );
  }
}

IconButton.propType = {
  handleClick: React.PropTypes.func,
  icon: React.PropTypes.icon,
  id: React.PropTypes.id
};