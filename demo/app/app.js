var demo = angular.module('demo', [ 'ngRoute', 'ngSanitize', 'angularListGroup' ]).config(
	[ '$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {

	    $routeProvider.when('/item', {
		templateUrl : 'partials/page-list-input-group-item.html'
	    }).when('/listgroup/basic', {
		templateUrl : 'partials/listgroup/basic-usage.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/selectable', {
		templateUrl : 'partials/listgroup/selectable.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/contextualclasses', {
		templateUrl : 'partials/listgroup/contextual-classes.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/disabled', {
		templateUrl : 'partials/listgroup/disabled.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/filtering', {
		templateUrl : 'partials/listgroup/filtering.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/templates', {
		templateUrl : 'partials/listgroup/templates.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/panel', {
		templateUrl : 'partials/listgroup/panel.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroupeditor/actions/builtin', {
		templateUrl : 'partials/listgroupeditor/builtin-actions.html',
		controller : 'ListGroupEditorCtrl'
	    }).when('/listgroupeditor/actions/custom', {
		templateUrl : 'partials/listgroupeditor/custom-actions.html',
		controller : 'ListGroupEditorCtrl'
	    }).when('/listgroupeditor/inline', {
		templateUrl : 'partials/listgroupeditor/inline.html',
		controller : 'ListGroupEditorCtrl'
	    }).otherwise({
		redirectTo : '/listgroup/basic'
	    });

	} ]).run([ '$sce', function($sce) {
    // $sce.trustAsUrl('partials/listgroup/templates.js');
} ]).controller('DemoCtrl', [ '$scope', '$location', function($scope, $location) {

    $scope.menus = [ {
	'title' : 'List Group',
	'items' : [ {
	    'title' : 'Basic Usage',
	    'path' : '/listgroup/basic'
	}, {
	    'title' : 'Selectable',
	    'path' : '/listgroup/selectable'
	}, {
	    'title' : 'Contextual classes',
	    'path' : '/listgroup/contextualclasses'
	}, {
	    'title' : 'Disabled items',
	    'path' : '/listgroup/disabled'
	}, {
	    'title' : 'Filtering',
	    'path' : '/listgroup/filtering'
	}, {
	    'title' : 'Custom templates',
	    'path' : '/listgroup/templates'
	}, {
	    'title' : 'Heading',
	    'path' : '/listgroup/panel'
	} ]
    }, {
	'title' : 'List Group Editor',
	'items' : [ {
	    'title' : 'Built-in actions',
	    'path' : '/listgroupeditor/actions/builtin'
	}, {
	    'title' : 'Custom actions',
	    'path' : '/listgroupeditor/actions/custom'

	}, {
	    'title' : 'Inline editing',
	    'path' : '/listgroupeditor/inline'
	} ]
    } ];

    $scope.selectedMenuItem;

    $scope.selectMenuItem = function(item) {
	$scope.selectedMenuItem = item;
	$location.path(item.path).replace();
    }

    $scope.item = "Gustave Courbet";

} ]);
