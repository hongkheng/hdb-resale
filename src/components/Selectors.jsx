import React from 'react';

export class DropDownList extends React.Component {
  render () {
    let listNodes = this.props.selections.map((item, index) => (
      <option key={index} value={item}>{item}</option>
    ));
    return (
      <form className='dropdown-list'>
        <select value={this.props.selectedValue} onChange={this.props.handleChange}>
          {listNodes}
        </select>
      </form>
    );
  }
}

export class ChartSelector extends React.Component {
  render () {
    return (
      <div className='listType'>
        <p className='dropdown-title'>Choose town & chart type</p>
        <DropDownList
          selections={this.props.townList}
          selectedValue={this.props.selectedTown}
          handleChange={this.props.updateTown} />
        <DropDownList
          selections={this.props.chartType}
          selectedValue={this.props.selectedChartType}
          handleChange={this.props.updateChartType} />
      </div>
    );
  }
}

export class MapSelector extends React.Component {
  render () {
    return (
      <div className='listType'>
        <p className='dropdown-title'>Choose month & flat type</p>
        <DropDownList
          selections={this.props.monthList}
          selectedValue={this.props.selectedMonth}
          handleChange={this.props.updateMonth} />
        <DropDownList
          selections={this.props.flatType}
          selectedValue={this.props.selectedFlatType}
          handleChange={this.props.updateFlatType} />
      </div>
    );
  }
}
