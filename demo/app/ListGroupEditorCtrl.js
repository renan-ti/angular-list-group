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
			    
			    $scope.onAddEventHandler = function(){
				$scope.eventHandlerMessage = 'Add event handler \'onAddEventHandler()\' has been invoked';
			    };
			    $scope.onEditEventHandler = function(item) {
				$scope.eventHandlerMessage = 'Edit event handler \'onEditEventHandler(' + item + ')\' has been invoked';
			    };
			    $scope.onDeleteEventHandler = function(item) {
				$scope.eventHandlerMessage = 'Delete event handler \'onDeleteEventHandler(' + item + ')\' has been invoked';
			    };
			    $scope.onAddEventHandler2 = function(){
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
			    
			} ]);