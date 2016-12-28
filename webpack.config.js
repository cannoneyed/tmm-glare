require('dotenv').config()
const _ = require('lodash')
const appConfig = require('config')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV

const ENV_DEVELOPMENT = NODE_ENV === 'development'
const ENV_PRODUCTION = NODE_ENV === 'production'
const ENV_TEST = NODE_ENV === 'test'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

//=========================================================
//  CONFIG
//---------------------------------------------------------
// We need to ensure that the serviceAccount key on the firebase config is not provided - this is a
// node-specific configuration option for server environments. Hence, we'll remove it from the
// config object passed to the client code
const configObject = _.assign({}, appConfig)
configObject.firebaseConfig = _.omit(appConfig.firebaseConfig, 'serviceAccount')
const CONFIG_OBJECT = configObject

//=========================================================
//  LOADERS
//---------------------------------------------------------
const loaders = {
  js: {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  scss: {
    test: /\.scss$/,
    loader: 'style!css!resolve-url!postcss-loader!sass',
  },
  scssProd: {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css!resolve-url!postcss-loader!sass')
  },
  img: {
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'url-loader?limit=8192',
  }, // inline base64 URLs for <=8k images, direct URLs for the rest

}


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {}
module.exports = config

config.resolve = {
  extensions: ['', '.ts', '.js'],
  modulesDirectories: ['node_modules', 'web_modules'],
  root: path.resolve('.')
}

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    '__CONFIG_OBJECT__': JSON.stringify(CONFIG_OBJECT),
  })
]

config.postcss = [
  autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR'] })
]

config.sassLoader = {
  outputStyle: 'compressed',
  precision: 10,
  sourceComments: false
}

//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.devtool = 'source-map'

  config.entry = {
    main: [
      './src/main'
    ],
    vendor: [
      'babel-polyfill',
      'classnames',
      'firebase',
      'history',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk'
    ]
  }

  config.output = {
    filename: '[name].js',
    path: path.resolve('./public'),
    publicPath: '/'
  }

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      inject: 'body',
      template: './src/index.html'
    })
  )
}

config.context = path.join(__dirname)


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.entry.main.unshift(
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/dev-server'
  )

  config.module = {
    loaders: [
      loaders.img,
      loaders.scss,
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: {
        plugins: [
          [
            'react-transform',
            {transforms: [ {transform: 'react-transform-hmr', imports: ['react'], locals: ['module']} ]}
          ]
        ]
      }}
    ]
  }

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  }
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  config.module = {
    loaders: [
      loaders.js,
      loaders.img,
      loaders.scssProd,
    ]
  }

  config.cache = false

  config.plugins.push(
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false
      }
    }),
    new CopyWebpackPlugin([{
      from: 'src/img',
      to: 'img',
    }, {
      from: 'src/privacy',
    }])
  )
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map'

  config.module = {
    loaders: [
      loaders.js,
      loaders.scss
    ]
  }
}
