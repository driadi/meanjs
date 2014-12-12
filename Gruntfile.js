'use strict';

module.exports = function(grunt) {
    // Unified Watch Object
    var watchFiles = {
        serverViews: ['app/views/**/*.*'],
        serverJS: ['Gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
        clientViews: ['public/modules/**/views/**/*.html'],
        clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
        clientCSS: ['public/modules/**/*.css'],
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
        }
    });

    require('load-grunt-tasks')(grunt);


    // Default task(s).
    grunt.registerTask('default', ['lint', 'test', 'run-dev']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('run-dev', ['env:development', 'nodemon']);
    grunt.registerTask('test', ['env:test', 'mochaTest']);
};