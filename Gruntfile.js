module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			js: {
				files: {
					'min/iexpect.min.js': [ 'app/*.js' ]
				}
			}
		},

		concat: {
			iexpectNodeModule: {
				src: [ 'app/*.js' ],

				dest: 'node_modules/iexpect.js'
			},

			specs: {
				src: [ 'test/*.js', 'test/**/*.js'],
				dest: 'min/iexpect-spec.concat.js'
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

            browserifyiexpectSpec: {
				options: {
					stderr: true,
					failOnError: true
				},

				command: 'browserify min/iexpect-spec.concat.js -o min/iexpect-spec.concat.browserified.js'
            }
        }
	});

	grunt.registerTask('build', [ 'concat', 'uglify', 'shell:browserifyiexpectSpec' ]);

	grunt.registerTask('test', [ 'build', 'shell:runMocha' ]);

	grunt.registerTask('server', [ 'build', 'shell:runServerScript' ]);

	grunt.loadNpmTasks('grunt-contrib-concat');
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