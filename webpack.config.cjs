const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const PATHS = { src: path.join(__dirname, 'src') };

const pages = ['index', 'sobre', 'depoimentos', 'plataforma', 'planos', 'politica-privacidade'];

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

  return {
    mode: isProd ? 'production' : 'development',

    entry: entryPoints,

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'js/[name].[contenthash].js',
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
      }),
      ...htmlPlugins,
      new CopyWebpackPlugin({
        patterns: [
          // Assets estáticos
          { from: 'src/imgs', to: 'imgs' },
          { from: 'src/videos', to: 'videos' },
          { from: 'src/legendas.vtt', to: 'legendas.vtt' },
          
          // Font Awesome (ícones)
          {
            from: path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
            to: 'fonts',
            filter: (resourcePath) => {
              // Copia apenas os arquivos de fonte necessários
              return /fa-(brands|solid|regular)-[0-9]+\.(woff2|woff|ttf)$/.test(path.basename(resourcePath));
            }
          },
          
          // Fontes Inter (principal, semibold e bold)
          {
            from: path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
            to: 'fonts',
            filter: (resourcePath) => {
              return /fa-(brands|solid|regular)-[0-9]+\.(woff2|woff|ttf)$/.test(path.basename(resourcePath));
            }
          }
        ]
      })
    ],

    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: true,
      compress: true,
      port: 9000,
      open: true,
      hot: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:5005',
          secure: false,
          changeOrigin: true,
          timeout: 120000,
        },
      ],
    },
  };
};