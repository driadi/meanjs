var sources = {
    lib: [
        'lib/angular/angular.min.js',
        'lib/angular-route/angular-route.min.js',
        'lib/angular-resource/angular-resource.min.js',
        'lib/checklist-model/checklist-model.js'
    ],
    js: [
        'application.js',
        'modules/*/*.js',
        'modules/*/*[!tests]*/*.js'
    ],
    test: [
        'lib/angular-mocks/angular-mocks.js',
        'modules/*/tests/*.js'
    ]
};

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: 'public',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: sources.lib.concat(sources.js, sources.test),
      
        // list of files to exclude
        exclude: [

        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['coverage', 'spec'],

        preprocessors: {
            'modules/**/*.js':['coverage']
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        coverageReporter: {
            type : 'html',
            dir : '../test_reports/karma/coverage/'
        }
    });
};
