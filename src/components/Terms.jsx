import React from 'react';

export default class Terms extends React.Component {
  render () {
    return (
      <article id='terms' className='terms'>
        <div className='terms-title'><h4>Terms of Use</h4></div>
        <p>The developers of this application are not liable for any direct or indirect damage or loss resulting from the use of any part of this application or its derivatives.</p>
        <p>Data analysis and representation are independent of the Singapore Government or its Statutory Boards.</p>
        <p>The datasets provided by the Singapore Government and its Statutory Boards via Data.gov.sg are governed by the Terms of Use available at <a href='https://data.gov.sg/terms'>https://data.gov.sg/terms</a>. To the fullest extent permitted by law, the Singapore Government and its Statutory Boards are not liable for any damage or loss of any kind caused directly or indirectly by the use of the datasets or any derived analyses or applications.</p>
        <button type='Accept' className='accept-terms' onClick={this.props.handleAccept}>Accept</button>
      </article>
    );
  }
}

Terms.propType = {
  handleAccept: React.PropTypes.func
};
