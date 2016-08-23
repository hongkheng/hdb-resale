import app from './app.js';
import devServer from './server.dev';

const port = process.env.PORT || 8080;

const nodeEnv = app.get('env');
console.log('node_env =', nodeEnv);

if (nodeEnv === 'development') {
  devServer();
}

app.listen(port);
console.log('Listening at:' + port);
