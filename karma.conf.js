module.exports = function(config) {
    config.set({
	basePath : '',
	frameworks : [ 'jasmine' ],

	preprocessors : {
	    'src/templates/*.html' : [ 'ng-html2js' ]
	},

	ngHtml2JsPreprocessor : {
	    stripPrefix : 'src/templates/'
	},

	files : [ 
	        'bower_components/jquery/dist/jquery.min.js',
	        'bower_components/angular/angular.min.js',
	        'bower_components/angular-sanitize/angular-sanitize.min.js',
		'bower_components/angular-mocks/angular-mocks.js',
		
		'src/templates/**/*.html',
		'src/namespace.js',
		'src/service/**/*.js',
		'src/filter/**/*.js',
		'src/directive/listGroup.js',
		'src/directive/listGroupEditor.js', 
		'test/**/*Spec.js' ],

	reporters : [ 'progress' ],
	browsers : [ 'Firefox' ],
	port : 9018,
	runnerPort : 9100,
	colors : true,
	logLevel : config.LOG_INFO,
	autoWatch : true,
	captureTimeout : 60000,
	singleRun : false
    });
};
