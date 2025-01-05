const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  components: 'src/components/**/*.{js,jsx}',
  ignore: ['**/node_modules/**'],
  require: [
    path.join(__dirname, 'src/index.css')
  ],
  sections: [
    {
      name: 'Components',
      components: 'src/components/**/*.{js,jsx}',
      sectionDepth: 1
    },
    {
      name: 'Pages',
      components: 'src/pages/**/*.{js,jsx}',
      sectionDepth: 1
    },
    {
      name: 'Hooks',
      content: 'docs/hooks.md'
    },
    {
      name: 'Utils',
      content: 'docs/utils.md'
    }
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: ['file-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        src: path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          REACT_APP_FIREBASE_API_KEY: JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
          REACT_APP_FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
          REACT_APP_FIREBASE_PROJECT_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID),
          REACT_APP_FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
          REACT_APP_FIREBASE_APP_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID)
        }
      })
    ]
  }
} 