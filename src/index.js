import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import App from './App';
import Charts from './Charts';
import Maps from './Maps';
import About from './About';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/charts" />
      <Route path="/charts" component={Charts} />
      <Route path="/maps" component={Maps} />
      <Route path="/about" component={About} />
    </Route>
  </Router>
  ), document.getElementById('root')
);