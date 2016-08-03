import app from './app.js'

const port = process.env.PORT || 8080

app.listen(port, '0.0.0.0')
console.log('Listening on port 0.0.0.0:' + port);

// TODO: refactor this code away from production code
// this if for development only

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

let server = new WebpackDevServer(webpack(config), {
  contentBase: './dist',
  hot: true,
  historyApiFallback: true,
  proxy: {
    "*": "http://localhost:8080"
  }
}).listen(9000, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 0.0.0.0:9000');
});