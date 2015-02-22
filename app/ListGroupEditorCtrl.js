demo
	.controller(
		'ListGroupEditorCtrl',
		[
			'$scope',
			'$q',
			'$log',
			function($scope, $q, $log) {

			    $scope.colors = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet' ];

			    $scope.myDeletableHandler = function(item) {
				return item != 'Orange' && item != 'Blue';
			    };

			    $scope.eventHandlerMessage = null;

			    $scope.onAddEventHandler = function() {
				$scope.eventHandlerMessage = 'Add event handler \'onAddEventHandler()\' has been invoked';
			    };
			    $scope.onEditEventHandler = function(item) {
				$scope.eventHandlerMessage = 'Edit event handler \'onEditEventHandler(' + item
					+ ')\' has been invoked';
			    };
			    $scope.onDeleteEventHandler = function(item) {
				$scope.eventHandlerMessage = 'Delete event handler \'onDeleteEventHandler(' + item
					+ ')\' has been invoked';
			    };
			    $scope.onAddEventHandler2 = function() {
				var deferred = $q.defer();
				deferred.resolve('purple');
				return deferred.promise;
			    };
			    $scope.onEditEventHandler2 = function(item) {
				var deferred = $q.defer();
				deferred.resolve(item + ' (edited)');
				return deferred.promise;
			    };
			    $scope.onDeleteEventHandler2 = function(item) {
				var deferred = $q.defer();
				deferred.resolve(item);
				return deferred.promise;
			    };

			    $scope.trackMessage = null;

			    $scope.tracks = [ {
				'nb' : 1,
				'title' : "Quand on n'a que l'amour",
				'time' : '2:23'
			    }, {
				'nb' : 2,
				'title' : "Qu'avons-nous fait, bonnes gens ?",
				'time' : '1:46'
			    }, {
				'nb' : 3,
				'title' : "Les Pieds dans le ruisseau",
				'time' : '2:52'
			    }, {
				'nb' : 4,
				'title' : "Pardons",
				'time' : '2:18'
			    }, {
				'nb' : 5,
				'title' : "La Bourr\u00e9e du c\u00e9libataire",
				'time' : '2:24'
			    }, {
				'nb' : 6,
				'title' : "L'Air de la b\u00e9tise",
				'time' : '4:23'
			    }, {
				'nb' : 7,
				'title' : "Saint-Pierre",
				'time' : '2:18'
			    }, {
				'nb' : 8,
				'title' : "J'en appelle",
				'time' : '2:43'
			    }, {
				'nb' : 9,
				'title' : "Heureux",
				'time' : '2:51'
			    }, {
				'nb' : 10,
				'title' : "Les Bl\u00e9s",
				'time' : '1:47'
			    } ];
			    
			    $scope.trackListTitle = 'Jasques Brel, Quand on n\'a que l\'amour (1957)';
			    $scope.trackTpl = '<div class="col-xs-1 text-right">{{item.nb}}</div><div class="col-xs-9">{{item.title}}</div><div class="col-xs-2 text-left">{{item.time}}</div>';

			    $scope.itemActions = [ {
				icon : 'fa-play',
				fn : function(item) {
				    $scope.trackMessage = "Play, " + angular.toJson(item);
				}
			    }, {
				icon : 'fa-pause',
				fn : function(item) {
				    $scope.trackMessage = "Pause, " + angular.toJson(item);
				}
			    }, {
				icon : 'fa-stop',
				fn : function(item) {
				    $scope.trackMessage = "Stop, " + angular.toJson(item);
				}
			    } ];
			} ]);