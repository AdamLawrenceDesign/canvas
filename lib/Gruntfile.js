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
					'src/image-upload.js',
					'src/pagnation.js',
					'src/list-builder.js',
					'src/element-builder.js',
					'src/scroll-manager.js',
					'src/export-json.js',
					'src/palette-manager.js',
					'src/canvas-addItems.js',
					'src/load-assets.js',
					'src/canvas-grid.js',
					'src/event-manager.js',
					'src/insert-json.js',
					'src/canvas-setup.js',
					'src/app-init.js'
				],
				dest : 'lib/create.js'
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
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'watch:files' ]);	
	
};	
