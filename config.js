'use strict';

module.exports = {

	//browserPort: 3000,
	browserPort: 3010,
	UIPort: 3001,
	proxy: 'amorphous.local', // vagrant box host to proxy PHP

	sourceDir: './',
	buildDir: './build/',
	prodDir: './dist/',

	styles: {
		src: 'sass/**/*.scss',
		dest: 'build/css',
		prodDest: 'dist/css',
		prodSourcemap: false,
		sassIncludePaths: []
	},
	components: {
		src: 'app/components/**/*.html' // Angular / other MVC frameworks
	},
	scripts: {
		src: 'src/**/*.js',
		baseUrl: './src',
		dest: 'build/js',
		prodDest: 'dist/js',
		entryFile: './src/index.js', // entry point for browserify
		outputFile: 'bundle.js'
	},

	images: {
		//src: '../../wp-content/uploads/**/*.{png,jpg,jpeg,gif}',
		src: 'assets/images/media_library/**/*.{png,jpg,jpeg,gif}',
		dest: 'build/uploads',
		prodDest: 'dist/uploads'
	},

	themeImages: {
		src: 'assets/images/**/*.{png,jpg,jpeg,gif}', // CMS image assets
		dest: 'build/images',
		prodDest: 'dist/images'
	},

	media: {
		src: 'app/media/**/*',
		dest: 'build/media',
		prodDest: 'dist/media'
	},

	fonts: {
		src: ['assets/fonts/**/*'],
		dest: 'build/fonts',
		prodDest: 'dist/fonts'
	},

	views: {
		index: 'app/**/*.html',
		src: 'app/views/**/*.html',
		dest: 'build/',
		prodDest: 'dist/'
	}
};
