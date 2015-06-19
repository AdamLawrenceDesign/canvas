module.exports = function(grunt) {
	
    grunt.initConfig(
	{
		pkg: '<json:package.json>',
		
		concat: {
			js : {
				src : [
					// 'src/*'
					'src/js/slimScroll.js',
					'src/js/masonry.pkgd.min.js',
					'src/js/image-preloader.js',
					'src/js/server-query.js',
					'src/js/canvas-save.js',
					'src/js/page-style.js',
					'src/js/image-upload.js',
					'src/js/pagnation.js',
					'src/js/list-builder.js',
					'src/js/layout-manager.js',
					'src/js/element-builder.js',
					'src/js/scroll-manager.js',
					'src/js/rotate-canvas.js',
					'src/js/palette-manager.js',
					'src/js/export-json.js',
					'src/js/canvas-add-images.js',
					'src/js/canvas-add-textItems.js',
					'src/js/load-assets.js',
					'src/js/canvas-grid.js',
					'src/js/event-manager.js',
					'src/js/insert-json.js',
					'src/js/search-and-replace.js',
					'src/js/canvas-setup.js',
					'src/js/app-init.js'
				],
				dest : 'prod/create.js'
			}
		},
		
		uglify: {
			js : {
				src : [
					'prod/create.js'
				],
				dest : 'prod/create.min.js'
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
		
		watch: {
		  files: ['src/js/*'],						// , 'src/css/*'		
		  tasks: ['concat:js', 'uglify:js']			// , 'concat:css', 'cssmin:css'
		}
			
    });
	
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');   
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'watch:files' ]);	
	
};	
