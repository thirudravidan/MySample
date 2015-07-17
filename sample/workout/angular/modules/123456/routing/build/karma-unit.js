module.exports = function ( karma ) {
  karma.set({
    /** 
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      'vendor/jquery/jquery-1.10.2.js',
      'vendor/angular/angular.js',
      'vendor/angular/ngDialog.js',
      'vendor/angular/carousel.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-animate/angular-route.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
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
      'vendor/barchart/MultiChart.js',
      'build/templates-app.js',
      'build/templates-common.js',
      'vendor/angular-mocks/angular-mocks.js',
      
      'src/**/*.js',
      'src/**/*.coffee',
    ],
    exclude: [
      'src/assets/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-coffee-preprocessor' ],
    preprocessors: {
      '**/*.coffee': 'coffee',
    },

    /**
     * How to report, by default.
     */
    reporters: 'dots',

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /** 
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'Firefox'
    ]
  });
};

