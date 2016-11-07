// any external vars needed for config
var neat = require('node-neat').includePaths;


// global base src and dest
var dest = './shopify-theme';
var src = './lib';

module.exports = {
  sass: {
    src: src + '/scss/*.{sass,scss}',
    srcWatch: src + '/scss/**/*.{sass,scss}',
    dest: dest + '/assets/',
    settings: {
      imagePath: 'images', // Used by the image-url helper
      includePaths: neat,
      sourceComments: 'map'
    },
    sourcemaps: {
      includeContent: false,
      sourceRoot: src
    }
  },
  images: {
    src: src + '/images/**',
    dest: dest + '/assets/'
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/js/app.js',
      dest: dest + '/assets/',
      outputName: 'app.js'
    }]
  }
};
