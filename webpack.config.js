const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

// progress plugins
const chalk = require('chalk');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');

const DEV_SERVER_PORT = 3000;

function getRules({ production }) {
  const styleLoader = {
    loader: 'style-loader',
    options: { sourceMap: true },
  };

  const cssLoader = {
    loader: 'css-loader',
    options: { sourceMap: true },
  };

  const postCssLoader = {
    loader: 'postcss-loader',
    options: { sourceMap: true },
  };

  const sassLoader = {
    loader: 'sass-loader',
    options: { sourceMap: !production },
  };

  const javascriptRule = {
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    query: { compact: false }
  };

  const cssRule = {
    test: /\.css$/,
    use:['style-loader','css-loader']
  };

  const scssRule = {
    test: /\.s[ca]ss$/,
    exclude: /(node_modules)/,
    use: ['style-loader', 'css-loader', 'sass-loader']
  };

  return [
    javascriptRule,
    cssRule,
    scssRule,
    {
      test: /.(png|jpg|gif)$/,
      use: 'file-loader',
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' },
        },
      ],
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/octet-stream' },
        },
      ],
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      use: 'file-loader',
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'image/svg+xml' },
        },
      ],
    },
    {
      test: require.resolve('jquery'),
      use: [
        {
          loader: 'expose-loader',
          options: 'jQuery',
        },
        {
          loader: 'expose-loader',
          options: '$',
        },
      ],
    },
  ];
}

function getPlugins({ production }) {
  return [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new SimpleProgressPlugin({
        messageTemplate: ['build :bar', chalk.blue(':percent'), ':elapsed seconds', ':msg'].join(' '),
        progressOptions: {
            complete: chalk.bgGreen(' '),
            incomplete: chalk.bgWhite(' '),
            width: 40,
            total: 200,
            clear: false
        }
    }),
  ];
}

module.exports = ({ production } = { production: false }) => ({

  entry: './dev/js/index.js',

  output: {
    path: path.resolve('./src'),
    filename: 'bundle.min.js'
  },

  watch: production,

  watchOptions: {
    ignored: /node_modules/
  },

  module: {
    rules: getRules({ production }),
  },

  plugins: getPlugins({ production }),

  resolve: {
    alias: {
      jquery: 'jquery/src/jquery',
    },
  },

  devtool: production ? '' : 'cheap-module-source-map',

  devServer: {
    inline: true,
    contentBase: './src',
    hotOnly: true,
    port: DEV_SERVER_PORT,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
