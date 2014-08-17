"use strict"

module.exports = function(grunt) {

    grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
	templates : [ 'templates/**.html' ],
	build : 'build',
	dist : 'dist',
	src : 'src',
	meta : {
	    banner : '/**\n' + ' * <%= pkg.name %>\n'
		    + ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
		    + ' * @link <%= pkg.homepage %>\n'
		    + ' * @author <%= pkg.author.name %> (<%= pkg.author.email %>)\n'
		    + ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */\n'
	},
	ngtemplates : {
	    listGroup : {
		cwd : 'src/templates',
		src : '*.html',
		dest : '<%= build %>/templates.js',
		options : {
		    module : 'angularListGroup',
		    htmlmin : {
			collapseWhitespace : true,
			collapseBooleanAttributes : true
		    }
		}
	    }
	},
	concat : {
	    dist : {
		options : {
		    banner : '(function(window, document) {\n\'use strict\';\n',
		    footer : '\n})(window, document);\n',
		    process : function(src, filepath) {
			return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
		    },
		    stripBanners : true
		},
		src : [ '<%= src %>/*.js', 
		        '<%= src%>/filter/*.js',
		        '<%= src%>/service/*.js', 
		        '<%= src %>/directive/list-group.js',
		        '<%= src %>/directive/list-input-group-item.js',
		        '<%= src %>/directive/list-group-editor.js',
			'<%= build %>/templates.js' ],
		dest : '<%= dist %>/<%= pkg.name %>.js',
	    },
	    banner : {
		options : {
		    banner : '<%= meta.banner %>',
		},
		files : [ {
		    expand : true,
		    cwd : '<%= dist %>',
		    src : '{,*/}*.js',
		    dest : '<%= dist %>'
		} ]
	    }
	},
	ngmin : {
	    dist : {
		files : [ {
		    src : '<%= dist %>/<%= pkg.name %>.js',
		    dest : '<%= dist %>/<%= pkg.name %>.js'
		} ]
	    }
	},
	uglify : {
	    dist : {
		files : [ {
		    expand : true,
		    cwd : '<%= dist %>',
		    src : '{,*/}*.js',
		    dest : '<%= dist %>',
		    ext : '.min.js'
		} ]
	    }
	},
	clean : {
	    options : {
		force : true
	    },
	    build : [ '<%= build %>' ],
	    docs : [ '<% dist %>/docs' ]
	},
	copy : {
	    demo : {
		files : [ {
		    expand : true,
		    cwd : '<%= dist %>',
		    src : [ '<%= pkg.name %>.js', '<%= pkg.name %>.min.js' ],
		    dest : 'demo'
		} ]
	    }
	},
	ngdocs : {
	    options : {
		dest : '<%= dist %>/docs',
		scripts : [ 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.js',
			'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-route.min.js',
			'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-animate.min.js',
			// '../angular-list-group.min.js'
			'../angular-list-group.js' ],
		// html5Mode: true,
		startPage : '/api',
		title : 'Angular List Group',
	    },
	    api : {
		src : [ 'src/**/*.js' ],
		title : 'API Documentation'
	    }
	},
	connect : {
	    options : {
		keepalive : true
	    },
	    server : {}
	}

    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // grunt.registerTask('build', [ 'ngtemplates', 'concat:dist', 'ngmin:dist',
    // 'uglify:dist', 'concat:banner', 'clean:build' ]);
    grunt.registerTask('build', [ 'ngtemplates', 'concat:dist', 'ngmin:dist', 'clean:build' ]);

    grunt.registerTask('docs', [ 'clean:docs', 'ngdocs' ]);
};