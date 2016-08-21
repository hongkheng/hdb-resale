import React from 'react';

export default class Table extends React.Component {
  render () {
    const colNames = this.props.colNames.map((colName, i) => (
      <th key={i}>{colName}</th>
    ));
    const rows = this.props.rows.map((r, i) => (
      <tr key={i}>{r.map((d, ii) => <td key={ii}>{d}</td>)}</tr>
    ));

    const beforeContents = this.props.colNames.map((cn, i) => (
      `.chart-detail td:nth-of-type(${i + 1}):before { content: "${cn}"}`
    )).join('\n');

    const noBeforeContents = this.props.colNames.map((cn, i) => (
      `.chart-detail td:nth-of-type(${i + 1}):before { content: ""}`
    )).join('\n');

    const styleBlock = [
      '@media (max-width: 750px) {',
      beforeContents,
      '}',
      '@media (min-width: 751px) {',
      noBeforeContents,
      '}'
    ];

    return (
      <div className='chart-detail'>
        <style>{styleBlock.join('\n')}</style>

        <h2 ref='title' dangerouslySetInnerHTML={{__html: this.props.title}}></h2>
        <table>
          <thead><tr>{colNames}</tr></thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

Table.propType = {
  title: React.PropTypes.string,
  colNames: React.PropTypes.arrayOf(React.PropTypes.string),
  rows: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string))
};
