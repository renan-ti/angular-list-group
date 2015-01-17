demo
	.controller(
		'ListGroupEditorCtrl',
		[
			'$scope',
			'$q',
			'$log',
			function($scope, $q, $log) {

			    $scope.colors = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet' ];

			    $scope.colors02 = angular.copy($scope.colors, $scope.colors03);

			    $scope.colors03 = angular.copy($scope.colors, $scope.colors03);

			    $scope.msg = '&nbsp;';

			    $scope.msg02 = '&nbsp;';

			    $scope.template = '<div class="row"><div class="col-xs-1">{{$$item.nb}}</div><div class="col-xs-10">{{$$item.title}}</div><div class="col-xs-1">{{$$item.time}}</div></div>';

			    $scope.tracks = [

			    {
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

			    /**
			     * 
			     */
			    $scope.deleteItem = function($item) {
				$log.debug('ListGroupEditorCtrl::deleteItem => ' + angular.toJson($item));
				var deferred = $q.defer();
				if (angular.isDefined($item)) {
				    $scope.msg = $scope.$message('deleteItem', $item);
				    deferred.resolve('ok');
				}
				return deferred.promise;
			    }

			    $scope.editItem = function($item) {
				$log.debug('ListGroupEditorCtrl::editItem => ' + angular.toJson($item));
				var deferred = $q.defer();
				if (angular.isDefined($item)) {
				    $scope.msg = $scope.$message('editItem', $item);
				    deferred.resolve('ok');
				}
				return deferred.promise;
			    }

			    $scope.play = function($item) {
				$log.debug('ListGroupEditorCtrl::play => ' + angular.toJson($item));
				$scope.msg02 = $scope.$message('play', angular.toJson($item));
			    }

			    $scope.pause = function($item) {
				$log.debug('ListGroupEditorCtrl::pause => ' + angular.toJson($item));
				$scope.msg02 = $scope.$message('pause', angular.toJson($item));
			    }

			    $scope.stop = function($item) {
				$log.debug('ListGroupEditorCtrl::stop => ' + angular.toJson($item));
				$scope.msg02 = $scope.$message('stop', angular.toJson($item));
			    }

			    $scope.$message = function(methodName, $item) {
				var text = 'Controller method <code>';
				text += methodName
				text += '</code> invoked with argument <code>$item</code> = \'';
				text += $item
				text += '\'';
				return text;
			    }

			    $scope.selection01;

			    $scope.selectionChangeHandler01 = function(items) {
				$scope.selection01 = items;
			    }

			} ]);