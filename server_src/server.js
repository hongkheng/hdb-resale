import app from './app.js';
import devServer from './server.dev';

const port = process.env.PORT || 8080;

const nodeEnv = process.env.NODE_ENV || 'development';
console.log('node env', nodeEnv);

if (nodeEnv === 'development') {
  devServer();
}

app.listen(port);
console.log('Listening at: ' + port);
