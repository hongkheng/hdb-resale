import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';

import App from './components/App';
import Charts from './components/Charts';
import Maps from './components/Maps';
import Areas from './components/Areas';
import About from './components/About';
import {ChartSelector, MapSelector, AreaSelector} from './components/Selectors';

import './css/style.css';

window.PouchDB = require('pouchdb');

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <Route path='charts(/:town)' components={{main: Charts, selector: ChartSelector}} />
      <Route path='maps(/:month)' components={{main: Maps, selector: MapSelector}} />
      <Route path='areas(/:month)' components={{main: Areas, selector: AreaSelector}} />
      <Route path='about' components={{main: About}} />
      <IndexRedirect to='/charts' />
      <Redirect from='*' to='/charts' />
    </Route>
  </Router>
), document.getElementById('root'));
