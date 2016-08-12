import React from 'react';
import { Link, withRouter } from 'react-router';

class Navigation extends React.Component {
  constructor() {
    super();
  }

  isCurrentRouteAbout(path) {
    return path !== '/about';
  }

  render() {
    let dropdownNodes = (
      <div className="listType">
        <p className="dropdown-title">Choose town & chart type</p>
        <DropDownList collection={this.props.list1} ref="priSelector" selectedValue={this.props.selectedList1Value} name="pri-selector" handleChange={this.props.handleList1Change}></DropDownList>
        <DropDownList collection={this.props.list2} ref="secSelector" selectedValue={this.props.selectedList2Value} name="sec-selector" handleChange={this.props.handleList2Change}></DropDownList>
      </div>
    );
    return (
      <header className="header">
        <ul className="navlist">
          <li><Link to="/charts">Charts</Link></li>
          <li><Link to="/maps">Maps</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        {this.isCurrentRouteAbout(this.props.location.pathname) && dropdownNodes}
      </header>
    );
  }
}

Navigation.propsType = {
  list1: React.PropTypes.array,
  list2: React.PropTypes.array,
  selectedList1Value: React.PropTypes.string,
  selectedList2Value: React.PropTypes.string,
  selectedTitle: React.PropTypes.string,
  handleInputChange: React.PropTypes.func
};

class ListItem extends React.Component {
  render() {
    return (<option value={this.props.value}>{this.props.value}</option>);
  }
}

class DropDownList extends React.Component {
  render() {
    let listNodes = this.props.collection.map( (item, index) => {
      return (
        <ListItem value={item} key={index}/>
      );
    });
    return (
      <form className="dropdown-list">
      <select name={this.props.name} value={this.props.selectedValue} ref="dropDownSelect" onChange={this.props.handleChange}>
        {listNodes}
      </select>
      </form>
    );
  }
}

DropDownList.propsType = {
  collection: React.PropTypes.array,
  name: React.PropTypes.string,
  selectedValue: React.PropTypes.string,
  handleChange: React.PropTypes.func
};

DropDownList.defaultProps = {
  collection: []
};

export default withRouter(Navigation);