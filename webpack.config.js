
var _ = require( 'lodash' );
var path = require( 'path' );
var webpack = require( 'webpack' );

var pathAppTo;

function pathTo() {
    return path.join( __dirname, 'src', path.join.apply( path, arguments ) );
}

pathAppTo = _.partial( pathTo, 'app' );

module.exports = function ( options ) {
    var config = _.merge( {}, {
        entry: {
            vendor: [
                'firebase',
                'reactfire',
                'react'
            ]
        },

        output: {
            path: path.join( __dirname, 'bundle' ),
            filename: 'app.compiled.js',
            publicPath: '/assets/js'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.ProvidePlugin( {
                React: 'react',
                'window.React': 'react'
            } ),
            new webpack.optimize.CommonsChunkPlugin( 'vendor', 'vendor.js' )
        ],
        resolve: {
            extensions: [ '', '.js', '.jsx' ],
            alias: {
                //application aliases
                compatibility: pathAppTo( 'compatibility' ),
                components: pathAppTo( 'components' ),
                pages: pathAppTo( 'pages' ),
                config: pathAppTo( './lib/js/app.js' ),
                "matches-selector/matches-selector": "desandro-matches-selector",
                "eventEmitter/EventEmitter": "wolfy87-eventemitter",
                "get-style-property/get-style-property": "desandro-get-style-property"
            }
        },
        module: {
            loaders: [
                { test: /\.(js|jsx)$/, exclude:/node_modules/, loader: 'babel-loader?stage=1&optional=runtime' },
                { test: /masonry-layout/, loader: 'imports?define=>false&this=>window'}

            ]
        },
        resolveLoader: {
            root: path.join( __dirname, 'node_modules' )
        }
    }, options.overrides );

    config.module.loaders = _.union( config.module.loaders, options.loaders );
    config.plugins = _.union( config.plugins, options.plugins );

    return config;
};
