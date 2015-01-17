"use strict"

module.exports = function(grunt) {

    grunt.initConfig({
	sass : {
	    dist : {
		files : {
		    'style/demo.css' : 'style/demo.scss'
		}
	    }
	},
	watch : {
	    scripts : {
		files : [ '**/*.scss' ],
		tasks : [ 'sass' ],
		options : {
		    spawn : false,
		},
	    },
	},
	connect : {
	    options : {
		keepalive : true
	    },
	    server : {}
	}
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
};