/**
 * Grunt tasks
 *
 * @copyright   (c) Develo Design 2015
 * @author      paul
 * @package     play-on-scroll
 * @date        08/06/15
 */

module.exports = function( grunt ){

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		bump: {

			options: {

				createTag: false,

				commit: false,

				files: [

					'package.json',

					'bower.json'
				],

				push: false,

				updateConfigs: ['pkg']
			}
		},

		uglify: {

			my_target: {

				files: {

					'scripts/play-on-scroll.min.js': ['scripts/play-on-scroll.js']
				}
			}
		},

		watch: {

			scripts: {

				files: 'scripts/play-on-scroll.js',

				tasks: ['uglify']
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-bump' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
};

