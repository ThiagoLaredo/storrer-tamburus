const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // <- adiciona isto aqui
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

const publicPath = '/';

const pages = ['index', 'projetos', 'projeto', 'sobre', 'contato'];

const entryPoints = pages.reduce((entries, page) => {
  const jsPath = `./src/js/pages/${page}.js`;
  if (fs.existsSync(jsPath)) {
    entries[page] = jsPath;
  }
  return entries;
}, {});

const htmlPlugins = pages.map(page => new HtmlWebpackPlugin({
  template: `./src/${page}.html`,
  filename: `${page}.html`,
  chunks: ['runtime', 'vendors', 'common', page],
  scriptLoading: 'defer',
  minify: {
    removeRedundantAttributes: false,
    collapseWhitespace: true,
    removeComments: true,
  },
}));

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const publicPath = '/';

  return {
    mode: isProd ? 'production' : 'development',
    entry: entryPoints,
    output: {
      path: PATHS.dist,
      publicPath: publicPath,
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].chunk.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { esmodules: true },
                  useBuiltIns: 'entry',
                  corejs: 3,
                  modules: false,
                }],
              ],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|webp|gif|avif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'imgs/[name][ext][query]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
      ],
    },
    optimization: {
      minimize: isProd,
      minimizer: isProd
        ? [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                compress: { drop_console: true },
              },
            }),
            new CssMinimizerPlugin(),
          ]
        : [],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'async',
            enforce: true,
          },
          commons: {
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minSize: 30000,
            chunks: 'all',
            enforce: true,
          }
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[name].[contenthash].chunk.css',
      }),
      ...htmlPlugins,
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/imgs', to: 'imgs' },
          {
            from: path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
            to: 'fonts',
            filter: (resourcePath) => {
              return /fa-(brands|solid|regular)-[0-9]+\.(woff2|woff|ttf)$/.test(path.basename(resourcePath));
            }
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify(publicPath),
        'process.env.CONTENTFUL_SPACE_ID': JSON.stringify(process.env.CONTENTFUL_SPACE_ID),
        'process.env.CONTENTFUL_ACCESS_TOKEN': JSON.stringify(process.env.CONTENTFUL_ACCESS_TOKEN),
        'process.env.CONTENTFUL_ENVIRONMENT': JSON.stringify(process.env.CONTENTFUL_ENVIRONMENT),
      })
    ],
    devServer: {
      static: {
        directory: PATHS.dist,
        publicPath: publicPath,
      },
      historyApiFallback: {
        rewrites: [
          { from: /^\/projetos\/?$/, to: '/projetos.html' }, // Galeria
          { from: /^\/projetos\/([^\/]+)\/?$/, to: '/projeto.html?slug=$1' }, // Detalhe
          { from: /\.(js|css|images|fonts)/, to: (context) => context.parsedUrl.pathname }
        ]
      },
      compress: true,
      port: 9000,
      open: true,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:5005',
          secure: false,
          changeOrigin: true,
          timeout: 120000,
        }
      ],
    },
  };
};