var path = require('path');
var webpack = require('webpack');

var autoprefixer = require('autoprefixer');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');



var nodeModulesPath = path.join(__dirname, '/node_modules/');

module.exports = {
    devtool: false,
    entry: {
        bundle: './src/main.js'
    },
    output: {
        path: path.join(__dirname, '/docs/'),
        filename: '[name]-[hash:5].min.js',
        chunkFilename: '[name]-[hash:5].chunk.js',
        publicPath: './'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            children: true,
            minChunks: 2,
            async: true,
        }),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
         new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.tpl.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            inject: 'body',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('[name]-[hash:5].min.css'),
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src'),
        }, {
            test: /\.less$/,
            exclude: [/node_modules/],
            loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]!resolve-url!postcss!less')
        }, {
            test: /\.css$/,
            exclude: [/node_modules/],
            loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]!postcss')
        }, {
            test:/\.(png|jpg)$/,
            exclude: [/node_modules/],
            loader: 'url-loader?limit=8192&name=build/[name].[ext]'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    postcss: [
        require('autoprefixer')
    ]
};