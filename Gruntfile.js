module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			specs: {
				src: [ 'test/*.js', 'test/**/*.js'],
				dest: 'min/iexpect-spec.concat.js'
			}
		},

		uglify: {
			uglifyIexpectBrowserified: {
				files: {
					'min/iexpect.browserified.min.js' : [ 'min/iexpect.browserified.js']
				}
			}
		},

		watch: {
			files: [ 'app/**/*', 'test/**/*', 'Gruntfile.js'],
			tasks: [ 'build', 'shell:runMocha' ],
			options: {
				atBegin: true
			}
		},
 
		shell: {
			copyModules: {
				options: {
					stderr: true,
					failOnError: true
				},

				command: 'cp app/*.js node_modules'
			},
			runMocha: {
				options: {
					stdout: true,
					stderr: true,
					failOnError: true,
					callback: mochaCallback
				},

				command: 'mocha'
            },

            runServerScript: {
				options: {
					stdout: true,
					stderr: true
				},

				command: 'node bin/serve'
            },

            browserifyIexpect: {
				options: {
					stderr: true,
					failOnError: true
				},

				command: 'browserify app/iexpect.js -o min/iexpect.browserified.js'
            },

            browserifyIexpectSpec: {
				options: {
					stderr: true,
					failOnError: true
				},

				command: 'browserify min/iexpect-spec.concat.js -o min/iexpect-spec.concat.browserified.js'
            }
        },

        jshint: {
			app: [ 'app/*.js' ]
        }
	});

	grunt.registerTask('build', [
		'concat',
		'shell:copyModules',
		'shell:browserifyIexpect',
		'shell:browserifyIexpectSpec',
		'uglify',
		'jshint'
	]);

	grunt.registerTask('test', [ 'build', 'shell:runMocha' ]);

	grunt.registerTask('server', [ 'build', 'shell:runServerScript' ]);

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');

	//Creates slightly nicer output when Mocha has test failures
	//See grunt-shell documents for info on this callback
	function mochaCallback(err, stdout, stderr, cb)
	{
		if(err) {
			grunt.log.write('❗ ');
			grunt.fail.warn("Mocha reported tests failed.\n\n", 3);
		} else {
			grunt.log.write("Mocha tests passed. 👍");
		}

		cb();
	}
};