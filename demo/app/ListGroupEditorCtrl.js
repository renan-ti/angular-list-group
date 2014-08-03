demo.controller('ListGroupEditorCtrl', [ '$scope', '$q', '$log', function($scope, $q, $log) {

    $scope.colors = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet' ];

    $scope.msg;

    /**
     * 
     */
    $scope.deleteItem = function($item) {
	$log.debug('ListGroupEditorCtrl::deleteItem => ' + angular.toJson($item));
	var deferred = $q.defer();
	if (angular.isDefined($item)) {
	    $scope.msg = 'Controller handled delete operation of item \'' + $item + '\'.'
	    deferred.resolve('ok');
	}
	return deferred.promise;
    }

} ]);