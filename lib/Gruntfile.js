module.exports = function(grunt) {
	
    grunt.initConfig(
	{
		pkg: '<json:package.json>',
		
		concat: {
			js : {
				src : [
					// 'src/*'
					'js/src/slimScroll.js',
					'js/src/masonry.pkgd.min.js',
					'js/src/image-preloader.js',
					'js/src/server-query.js',
					'js/src/canvas-save.js',
					'js/src/page-style.js',
					'js/src/image-upload.js',
					'js/src/pagnation.js',
					'js/src/list-builder.js',
					'js/src/layout-manager.js',
					'js/src/element-builder.js',
					'js/src/scroll-manager.js',
					'js/src/rotate-canvas.js',
					'js/src/palette-manager.js',
					'js/src/export-json.js',
					'js/src/canvas-add-images.js',
					'js/src/canvas-add-textItems.js',
					'js/src/load-assets.js',
					'js/src/canvas-grid.js',
					'js/src/event-manager.js',
					'js/src/insert-json.js',
					'js/src/search-and-replace.js',
					'js/src/canvas-setup.js',
					'js/src/app-init.js'
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
