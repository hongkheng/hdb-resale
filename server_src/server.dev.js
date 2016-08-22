import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../webpack.dev.config';

export default function () {
  let server = new WebpackDevServer(webpack(config), {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    proxy: {
      '*': 'http://localhost:8080'
    },
    stats: { colors: true }
  });
  server.listen(9000, '0.0.0.0', function (err, result) {
    if (err) console.log(err);
    console.log('Listening at 0.0.0.0:9000');
  });
}
