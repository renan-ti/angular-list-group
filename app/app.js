var demo = angular.module('demo', [ 'ngRoute', 'ngSanitize', 'listGroup' ]).config(
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
	    }).when('/listgroup/heading', {
		templateUrl : 'partials/listgroup/heading.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/datasource', {
		templateUrl : 'partials/listgroup/datasource.html',
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
	    }).when('/listgroupeditor/selectable', {
		templateUrl : 'partials/listgroupeditor/selectable.html',
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
	    'title' : 'Disabled items',
	    'path' : '/listgroup/disabled'
	}, {
	    'title' : 'Contextual classes',
	    'path' : '/listgroup/contextualclasses'
	}, {
	    'title' : 'Filtering',
	    'path' : '/listgroup/filtering'
	}, {
	    'title' : 'Custom templates',
	    'path' : '/listgroup/templates'
	}, {
	    'title' : 'Heading',
	    'path' : '/listgroup/heading'
	}, {
	    'title' : 'Datasource',
	    'path' : '/listgroup/datasource'
	} ]
    }, {
	'title' : 'List Group Editor',
	'items' : [ {
	    'title' : 'Built-in actions',
	    'path' : '/listgroupeditor/actions/builtin'
	}, {
	    'title' : 'Custom actions',
	    'path' : '/listgroupeditor/actions/custom'

	}
//	, {
//	    'title' : 'Inline editing',
//	    'path' : '/listgroupeditor/inline'
//	}
	, {
	    'title' : 'Selectable',
	    'path' : '/listgroupeditor/selectable'
	} 
	]
    } ];

    $scope.selectedMenuItem;

    $scope.selectMenuItem = function(item) {
	$scope.selectedMenuItem = item;
	$location.path(item.path).replace();
    }

    $scope.item = "Gustave Courbet";

} ]);

demo.directive('prism', [ function() {
    return {
	restrict : 'A',
	link : function($scope, element, attrs) {
	    element.ready(function() {
		Prism.highlightElement(element[0]);
	    });
	}
    }
} ]);