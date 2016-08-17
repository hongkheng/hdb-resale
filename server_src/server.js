import app from './app.js';

const port = process.env.PORT || 8080;

const node_env = process.env.NODE_ENV|| 'development';

console.log('node env', node_env);

if (node_env === 'development') {

  const wpBundle = require('./server.dev');
  wpBundle();

}

app.listen(port);
console.log('Listening at: ' + port);