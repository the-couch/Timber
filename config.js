
// global base src and dest
var dest = './';
var src = './lib';

module.exports = {
  sass: {
    src: src + '/scss/*.{sass,scss}',
    srcWatch: src + '/scss/**/*.{sass,scss}',
    dest: dest + '/assets/',
    settings: {
      imagePath: 'images', // Used by the image-url helper
      sourceComments: 'map'
    },
    sourcemaps: {
      includeContent: false,
      sourceRoot: src
    }
  }
}
