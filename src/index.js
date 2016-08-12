import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import App from './components/App';
import Charts from './components/Charts';
import Maps from './components/Maps';
import About from './components/About';
window.PouchDB = require('pouchdb');

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/charts(/:town)" />
      <Route path="/charts(/:town)" component={Charts} checkPath="charts"/>
      <Route path="/maps(/:month)" component={Maps} checkPath="maps"/>
      <Route path="/about" component={About} />
    </Route>
  </Router>
  ), document.getElementById('root')
);