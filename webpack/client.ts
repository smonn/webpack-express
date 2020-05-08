import LoadableWebpackPlugin from '@loadable/webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import merge from 'webpack-merge';
import parsePort from '../src/shared/utils/parsePort';
import { DEV, DIST, SRC } from './constants';
import shared from './shared';

const port = parsePort(process.env.PORT) + 1;

const client = merge(shared, {
  name: 'client',
  devtool: DEV ? 'eval-source-map' : 'source-map',
  entry: {
    client: DEV
      ? ['react-hot-loader/patch', path.resolve(SRC, 'client')]
      : ['react-hot-loader/patch', path.resolve(SRC, 'client')],
  },
  target: 'web',
  output: {
    publicPath: DEV ? `http://localhost:${port}/static/` : `/static/`,
    path: path.resolve(DIST, 'static'),
    filename: '[name].js',
  },
  devServer: DEV
    ? {
        compress: true,
        hot: true,
        noInfo: true,
        overlay: true,
        port,
        publicPath: `http://localhost:${port}/static/`,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    : undefined,
  plugins: DEV
    ? [
        new ForkTsCheckerWebpackPlugin({
          async: false,
          eslint: true,
        }),
        new LoadableWebpackPlugin({
          writeToDisk: {
            filename: path.resolve(DIST, 'static'),
          },
        }),
      ]
    : [new ForkTsCheckerWebpackPlugin(), new LoadableWebpackPlugin()],
});

export default client;
