var demo = angular
	.module('demo', [ 'ngRoute', 'ngSanitize', 'angularListGroup' ])
	.config([ '$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {

	    $routeProvider.when('/', {
		templateUrl : 'partials/index.html'
	    }).when('/item', {
		templateUrl : 'partials/page-list-input-group-item.html'
	    }).when('/listgroup/basic', {
		templateUrl : 'partials/listgroup/basic-usage.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/selectable', {
		templateUrl : 'partials/listgroup/selectable.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/filtering', {
		templateUrl : 'partials/listgroup/filtering.html',
		controller : 'ListGroupCtrl'
	    }).when('/listgroup/templates', {
		templateUrl : 'partials/listgroup/templates.html',
		controller : 'ListGroupCtrl'
	    }).otherwise({
		redirectTo : '/'
	    });

	} ])
	.run([ '$sce', function($sce) {
	    //$sce.trustAsUrl('partials/listgroup/templates.js');
	} ])
	.controller(
		'DemoCtrl',
		[
			'$scope',
			'$location',
			function($scope, $location) {

			    $scope.menus = [ {
				'title' : 'List Group',
				'items' : [ {
				    'title' : 'Basic Usage',
				    'path' : '/listgroup/basic'
				}, {
				    'title' : 'Selectable',
				    'path' : '/listgroup/selectable'
				}, {
				    'title' : 'Filtering',
				    'path' : '/listgroup/filtering'
				}, {
				    'title' : 'Custom templates',
				    'path' : '/listgroup/templates'
				} ]
			    } ];

			    $scope.selectedMenuItem;

			    $scope.selectMenuItem = function(item) {
				$scope.selectedMenuItem = item;
				$location.path(item.path).replace();
			    }

			    $scope.item = "Gustave Courbet";

			    $scope.oItem = {
				"name" : "Gustave Courbet"
			    };

			    $scope.edgarDegas = {
				"firstname" : "Edgar",
				"lastname" : "Degas",
				"thumbnail" : "http://thehumaninloved.files.wordpress.com/2013/12/paintings-by-hilaire-germain-edgar-degas-7.jpg"
			    };

				    $scope.items = [ {
					"name" : "Edgar Degas"
				    }, {
					"name" : "Henri de Toulouse Lautrec"
				    }, {
					"name" : "Alfred Sisley"
				    } ],

				    $scope.handleEditAction = function(item) {
					$scope.handleEditActionOutcome = 'Edit item => ' + JSON.stringify(item);
				    },

				    $scope.handleDeleteAction = function(item) {
					$scope.handleDeleteActionOutcome = 'Delete item => ' + JSON.stringify(item);
				    },

				    $scope.play = function(item) {
					$scope.customActionsMsg = 'Play => ' + JSON.stringify(item);
				    },

				    $scope.pause = function(item) {
					$scope.customActionsMsg = 'Pause => ' + JSON.stringify(item);
				    },

				    $scope.stop = function(item) {
					$scope.customActionsMsg = 'Stop => ' + JSON.stringify(item);
				    },

				    $scope.save = function(item) {
					$scope.dropdownActionMsg = 'Save => ' + JSON.stringify(item);
				    },

				    $scope.remove = function(item) {
					$scope.dropdownActionMsg = 'Remove => ' + JSON.stringify(item);
				    },

				    $scope.template = '<img src="{{item.thumbnail}}" style="width:24px;height:24px;" > <span style="color:blue;">{{item.firstname}}</span> <span style="text-transform:uppercase;color:green;">{{item.lastname}}</span>'

			    $scope.model = {
				selected : false
			    },

			    $scope.getLabel = function(item) {
				return item.name;
			    }

			} ]);
