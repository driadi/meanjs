'use strict';

module.exports = function(grunt) {
    // Unified Watch Object
    var watchFiles = {
        serverJS: ['Gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
        clientJS: ['public/*.js', 'public/modules/**/*.js'],
        mochaTests: ['app/tests/**/*.js']
    };

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: watchFiles.clientJS.concat(watchFiles.serverJS),
                options: {
                    jshintrc: true
                }
            },
            test: {
                src: watchFiles.mochaTests,
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html',
                    watch: watchFiles.serverJS
                }
            }
        },
        env: {
            development: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: ['server']
                },
                src: watchFiles.mochaTests
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'test', 'run-dev']);

    grunt.registerTask('run-dev', ['env:development', 'nodemon']);
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma']);
};