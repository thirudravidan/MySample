/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js','!src/**/*_*.js'],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/jquery-1.10.2.js',      
      'vendor/angular/angular.js',            
      'vendor/angular/ngDialog.js',
      'vendor/angular/carousel.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-animate/angular-route.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
	     'vendor/angular-cookies/angular-cookies.js',
      'vendor/jquery/src/moment.min.js',      
      'vendor/jquery/src/fullcalendar.min.js',
      'vendor/jquery/src/tooltip.js', 
      'vendor/jquery/bootstrap.js',            
      'vendor/jquery/bootstrap-datepicker.js',
      'vendor/jquery/bootstrap.timepicker.min.js',
      'vendor/jquery/jquery.slimscroll.js',
      'vendor/aws/aws-sdk-2.1.4.min.js',
      'vendor/aws/base64-binary.js',
      'vendor/aws/sha1.js',
      'vendor/aws/webtoolkit.base64.js',
      'vendor/guage/d3.v2.js',
      'vendor/guage/gauge.js',
      'vendor/barchart/d3.min.js',
      'vendor/jquery/src/star-rating.js',
      'vendor/networkspeed/nwspeed.js',
      'vendor/jquery/bootstrapValidator.js',
      'vendor/jquery/jquery.validate.min.js',
      'vendor/jquery/jquery.loader.min.js',
      'vendor/rightnowchat/RightNow.Client.js',
      'vendor/barchart/MultiChart.js'
      ],
    css: [     
    ],
    assets: [
    ]
  },
};
