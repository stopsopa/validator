// Karma configuration
// Generated on Thu Nov 29 2018 23:18:57 GMT+0000 (GMT)


module.exports = function(config) {
  const c = {

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',


      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['jasmine'],


      // list of files / patterns to load in the browser
      files: [
          // 'test-main.js',
          // { pattern: 'test/**/*.test.js', included: true },
          // { pattern: 'validator/**/*.js', included: false },


          { pattern: process.env.KARMAFILTER || 'karma_build/**/*.test.js', included: true },
          // { pattern: 'karma_build/constraints-All.test', included: true },
      ],


      // list of files / patterns to exclude
      exclude: [
          // 'karma_build/main.test.js'
      ],


      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
          // ['./test/**/*.test.js']: ['webpack'],
      },

      // webpackPreprocessor: {
      //     configPath: './config/webpack'
      // },


      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress'],


      // web server port
      port: 9876,


      // enable / disable colors in the output (reporters and logs)
      colors: true,


      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,


      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,


      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      //browsers: ['Chrome', 'Firefox', 'Safari', 'Opera'],
      browsers: [
          'Chrome',
          // 'Firefox',
          // 'Safari'
      ],


      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: true,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity
  };

  if (process.env.BROWSER) {

      c.browsers = [process.env.BROWSER]
  }

  config.set(c)
}
