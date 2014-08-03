/**
 * 
 */
angularListGroupDirectives.directive('listGroupEditor', [ '$parse', '$compile', '$interpolate', '$q', '$http',
	'$templateCache', function($parse, $compile, $interpolate, $q, $http, $templateCache) {

	    var ListGroupEditorCtrl = [ '$scope', '$filter', '$log', function($scope, $filter, $log) {

		$scope.$$delete = function($item) {
		    $log.debug("delete item => " + angular.toJson($item));
		    var p = $scope.deletable({
			$item : $item
		    });
		    if (p && angular.isFunction(p.then)) {
			p.then(function(data) {
			    $scope.items = $filter('filter')($scope.items, function(item) {
				return $item !== item;
			    });
			});
		    } else {
			throw new Error("Delete callback must return a Promise");
		    }
		}

		$scope.$$isDeletable = function() {
		    return angular.isDefined($scope.deletable);
		}

	    } ];

	    var resolveInnerHTML = function(scope, attrs) {
		var resolved = false;
		var deferred = $q.defer();
		var promise = deferred.promise;
		var tokens = [ '<list-input-group-item ng-repeat="item in items" ng-model="item" ' ];

		if (scope.$$isDeletable()) {
		    tokens.push('deletable delete-fn="$$delete(item)"');
		}

		// html += 'deletable editable
		// actions=\'[{"id":"play","icon":"glyphicon-play",
		// "fn":"play(item)"},{"id":"pause","icon":"glyphicon-pause",
		// "fn":"pause(item)"},{"id":"stop","icon":"glyphicon-stop",
		// "fn":"stop(item)"}]\'>';
		tokens.push('>');
		tokens.push('</list-input-group-item>');
		deferred.resolve(tokens.join(' '));
		return promise;
	    }

	    return {
		restrict : 'EA',
		terminal : true,
		replace : true,
		template : function(elem, attrs) {
		    var tpl = $templateCache.get('panel-list-editor.html');
		    return tpl;
		},
		controller : ListGroupEditorCtrl,
		scope : {
		    items : '=',
		    deletable : '&'
		},
		link : function(scope, element, attrs) {
		    scope.test = 'toto';

		    var promise = resolveInnerHTML(scope, attrs);
		    promise.then(function(html) {
			var cellElement = angular.element(html);
			element.append(cellElement);
			$compile(element)(scope);
		    });

		}
	    }
	} ]);