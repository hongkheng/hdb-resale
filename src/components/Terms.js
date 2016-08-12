import React from 'react';

class Terms extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <article id="terms" className={this.props.shouldHide ? 'terms hidden' : 'terms'}>
       <div className="terms-title"><h4>Terms of Use</h4></div>
       <p>The developers of this application are not liable for any direct or indirect damage or loss resulting from the use of any part of this application or its derivatives.</p>
       <p>Data analysis and representation are independent of the Singapore Government or its Statutory Boards.</p>
      <p>The datasets provided by the Singapore Government and its Statutory Boards via Data.gov.sg are governed by the Terms of Use available at <a href="https://data.gov.sg/terms">https://data.gov.sg/terms</a>. To the fullest extent permitted by law, the Singapore Government and its Statutory Boards are not liable for any damage or loss of any kind caused directly or indirectly by the use of the datasets or any derived analyses or applications.</p>
       <button type="Accept" name="Accept" className="accept-terms" onClick={this.props.handleAccept}>Accept</button>
     </article>
    );
  }

}

Terms.propType = {
  shouldHide: React.PropTypes.bool,
  handleAccept: React.PropTypes.func
};

Terms.defaultProps = {
  shouldHide: true
};

export default Terms;