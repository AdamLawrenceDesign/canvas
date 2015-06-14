module.exports = function(grunt) {
	
    grunt.initConfig(
	{
		pkg: '<json:package.json>',
		
		concat: {
			js : {
				src : [
					// 'src/*'
					'src/slimScroll.js',
					'src/masonry.pkgd.min.js',
					'src/image-preloader.js',
					'src/server-query.js',
					'src/page-style.js',
					'src/image-upload.js',
					'src/pagnation.js',
					'src/list-builder.js',
					'src/element-builder.js',
					'src/scroll-manager.js',
					'src/export-json.js',
					'src/palette-manager.js',
					'src/canvas-add-images.js',
					'src/canvas-add-textItems.js',
					'src/load-assets.js',
					'src/canvas-grid.js',
					'src/event-manager.js',
					'src/search-and-replace.js',
					'src/insert-json.js',
					'src/canvas-setup.js',
					'src/app-init.js'
				],
				dest : 'lib/create.js'
			}
		},

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'prod/screen.css':'src/sass/screen.scss'
				}
			}
		},
		
		uglify: {
			js : {
				src : [
					'lib/create.js'
				],
				dest : 'lib/create.min.js'
			}
		},
		
		watch: {
		  files: ['src/*'],						// , 'src/css/*'		
		  tasks: ['concat:js', 'uglify:js']			// , 'concat:css', 'cssmin:css'
		}
			
    });
	
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');   
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'watch:files' ]);	
	
};	
