import React from 'react';
import maincss from './css/style.css';
import { Link } from 'react-router';

class App extends React.Component {
  componentDidMount() {
      console.log('app', this.props);
  }
  render() {
    return (
      <div>
        <header className="header">
          <ul className="navlist">
            <li><Link to="/charts">Charts</Link></li>
            <li><Link to="/maps">Maps</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <div className="listType">

          </div>
        </header>
        {this.props.children}
        <footer>This is the footer</footer>
      </div>
    );
  }
}

export default App;