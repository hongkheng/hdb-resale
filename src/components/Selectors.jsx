import React from 'react';

export class DropDownList extends React.Component {
  render () {
    let listNodes = this.props.selections.map((item, index) => (
      <option key={index} value={item}>{item}</option>
    ));
    return (
      <select className='dropdown-select' value={this.props.selectedValue} onChange={this.props.handleChange}>
        {listNodes}
      </select>
    );
  }
}

DropDownList.propType = {
  selections: React.PropTypes.arrayOf(React.PropTypes.string),
  selectedValue: React.PropTypes.string,
  handleChange: React.PropTypes.func
};

export class ChartSelector extends React.Component {
  render () {
    return (
      <div className='listType'>
        <p className='dropdown-title'>Choose town & chart type</p>
        <form className='dropdown-list'>
          <DropDownList
            selections={this.props.townList}
            selectedValue={this.props.selectedTown}
            handleChange={this.props.updateTown} />
          <DropDownList
            selections={this.props.chartType}
            selectedValue={this.props.selectedChartType}
            handleChange={this.props.updateChartType} />
        </form>
      </div>
    );
  }
}

ChartSelector.propType = {
  townList: React.PropTypes.arrayOf(React.PropTypes.string),
  chartType: React.PropTypes.arrayOf(React.PropTypes.string),
  selectedTown: React.PropTypes.string,
  selectedChartType: React.PropTypes.string,
  updateTown: React.PropTypes.func,
  updateChartType: React.PropTypes.func
};

export class MapSelector extends React.Component {
  render () {
    return (
      <div className='listType'>
        <p className='dropdown-title'>Choose month & flat type</p>
        <form className='dropdown-list'>
          <DropDownList
            selections={this.props.monthList}
            selectedValue={this.props.selectedMonth}
            handleChange={this.props.updateMonth} />
          <DropDownList
            selections={this.props.flatType}
            selectedValue={this.props.selectedFlatType}
            handleChange={this.props.updateFlatType} />
        </form>
      </div>
    );
  }
}

MapSelector.propType = {
  monthList: React.PropTypes.arrayOf(React.PropTypes.string),
  flatType: React.PropTypes.arrayOf(React.PropTypes.string),
  selectedMonth: React.PropTypes.string,
  selectedFlatType: React.PropTypes.string,
  updateMonth: React.PropTypes.func,
  updateFlatType: React.PropTypes.func
};
