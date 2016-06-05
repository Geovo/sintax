module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    // load watcher task
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['tests/**/*.js']
            }
        }
    });

    grunt.registerTask('default', 'mochaTest');

    grunt.config('watch', {
        scripts: {
            files: ['src/**/*.js', "tests/**/**.js"],
            tasks: ['default'],
            options: {
                spawn: false
            }
        },
    });

};
