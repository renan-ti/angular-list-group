var ListGroupCtrl = function($scope, $parse, $filter, comparatorFactory) {

    $scope.$$selectedItems = [];

    $scope.$$items;

    $scope.filter = {
	text : '',
	placeholder : 'Search...',
	autoFilter : true,
	ignoreCase : false
    }

    $scope.$selectItem = function(item) {
	if (!$scope.$isDisabled(item)) {
	    var idx = -1;
	    if ((idx = $scope.$isSelected(item)) > -1) {
		$scope.$$selectedItems.splice(idx, 1);
	    } else {
		if ($scope.$$selectedItems.length > 0 && !$scope.multiSelection == true) {
		    $scope.$$selectedItems.length = 0;
		}
		$scope.$$selectedItems.push(item);
	    }
	}
    }

    $scope.$isSelected = function(item) {
	var idx = -1;
	for ( var i = 0, len = $scope.$$selectedItems.length; i < len; i++) {
	    if (item === $scope.$$selectedItems[i]) {
		idx = i;
		break;
	    }
	}
	return idx;
    };

    $scope.$isDisabled = function(item) {
	var disabled = ($scope.disabled === 'true');
	if (!disabled) {
	    var fn = $parse($scope.disabled);
	    disabled = fn($scope.$parent, {
		item : item
	    });
	}
	return disabled;
    }

    $scope.$evalContextualClass = function(item) {
	var fn = $parse($scope.contextualClass);
	var clazz = fn($scope.$parent, {
	    $item : item
	});
	return $filter('listGroupItemContextualClass')(clazz);
    }

    $scope.$filter = function() {
	var comparator;
	if (angular.isDefined($scope.filter.operator)) {
	    comparator = comparatorFactory[$scope.filter.operator];
	    comparator.ignoreCase = $scope.filter.ignoreCase;
	}
	$scope.$$items = $filter('filter')($scope.items, $scope.filter.text, comparator);
    };

    $scope.$isFilterable = function() {
	return angular.isDefined($scope.filterable);
    };

    $scope.$resolvePanelContextualClassName = function() {
	var ctx = 'default';
	if (angular.isDefined($scope.panel)) {
	    ctx = $scope.panel;
	}
	return 'panel-' + ctx;
    };

    var unbindSelectionChangeWatcher = $scope.$watch('$$selectedItems', function(newVal, oldVal) {
	var fn = $parse($scope.selectionChange);
	var args = {
	    item : newVal[0]
	};
	if ($scope.multiSelection == true) {
	    args = {
		items : newVal
	    }
	}
	fn($scope.$parent, args);
    }, true);

    var unbindFilterWatcher = $scope.$watch('filter.text', function(newVal, oldVal) {
	if ($scope.filter.autoFilter == true) {
	    $scope.$filter();
	}
    });

    $scope.$on('$destroy', function() {
	unbindSelectionChangeWatcher();
	unbindFilterWatcher();
    });

};

/**
 * @ngdoc directive
 * @name listGroup
 * 
 * @restrict A
 * 
 * @description Bootstrap list group
 * 
 * @param {Array}
 *                items Items to be displayed as list group
 * @param {Boolean|String}
 *                selectable Enables or disables item selection (default:
 *                false).
 *                <ul>
 *                <li>true, enables single item selection</li>
 *                <li>'single', enables single item selection</li>
 *                <li>'multiple', enables multiple item selection</li>
 *                </ul>
 * 
 * @param {Boolean|Object}
 *                filterable Makes the filter input visible or not (default :
 *                `false`)
 *                <p>
 *                Object properties :
 *                </p>
 *                <ul>
 *                <li> **placeholder** : _{String}_ text for filter input
 *                (default : `Search...`) </li>
 *                <li>**ignoreCase** : _{Boolean}_ Flag indicating if filter
 *                expression is case sensitive or not (default: `false`). Only
 *                applies if an `operator` is specified</li>
 *                <li>**autoFilter** : _{Boolean}_ Flag indicating whether
 *                filtering should be performed on every key up event or when
 *                the `Search` button is pressed (default : `true`) </li>
 *                <li>**operator** : _{String}_ Specify the comparison operator
 *                used for filtering. Operators are "**eq**" (equal to),
 *                "**neq**" (not equal to), "**startswith**", "**endswith**",
 *                "**contains**"</li>
 *                </ul>
 * 
 * @param {function}
 *                selectionChange Callback called when the list group selection
 *                has changed.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 */

angularListGroupDirectives
	.value('selectableListGroupTpl', 'selectable-list-group.html')
	.value('listGroupTpl', 'list-group.html')
	.directive('selectableListGroupTemplate', function(selectableListGroupTpl) {
	    return {
		replace : true,
		restrict : 'E',
		templateUrl : selectableListGroupTpl
	    };
	})
	.directive('listGroupTemplate', function(listGroupTpl) {
	    return {
		replace : true,
		restrict : 'E',
		templateUrl : listGroupTpl
	    };
	})
	.directive(
		'listGroup',
		[
			'$parse',
			'$compile',
			'$interpolate',
			'$q',
			'$http',
			'$templateCache',
			'$filter',
			'selectableListGroupTpl',
			'listGroupTpl',
			function($parse, $compile, $interpolate, $q, $http, $templateCache, $filter,
				selectableListGroupTpl, listGroupTpl) {

			    var getTemplate = function(templateUrl) {
				return $http.get(templateUrl, {
				    cache : $templateCache
				});
			    }

			    var resolveInnerHTML = function(scope, attrs) {
				var resolved = false;
				var deferred = $q.defer();
				var promise = deferred.promise;
				var html = '';
				var contextualClass = $filter('listGroupItemContextualClass')(attrs.contextualClass);
				if (scope.$$isSelectable()) {
				    html += '<a  class="list-group-item '
					    + contextualClass
					    + '" ng-repeat="item in $$items" ng-href  ng-class="{active : ($isSelected(item) != -1), disabled : $isDisabled(item) }" ng-click="$selectItem(item)">';
				} else {
				    html += '<li class="list-group-item ' + contextualClass
					    + '" ng-repeat="item in $$items">';
				}

				if (angular.isDefined(attrs.template)) {
				    html += scope.$parent.$eval(attrs.template);
				    resolved = true;
				} else if (angular.isDefined(attrs.templateUrl)) {
				    var templateUrl = scope.$parent.$eval(attrs.templateUrl);
				    getTemplate(templateUrl).success(function(data) {
					html += data;
					html += (scope.$$isSelectable() ? '</a>' : '</li>');
					deferred.resolve(html);
				    });
				} else {
				    html += '<span ng-bind="item"></span>';
				    // promise = deferred.promise;
				    resolved = true;
				}
				if (resolved) {
				    html += (scope.$$isSelectable() ? '</a>' : '</li>');
				    deferred.resolve(html);
				}
				return promise;
			    }

			    return {
				restrict : 'EA',
				terminal : true,
				replace : true,
				template : function(elem, attrs) {
				    var tpl = '<div class="list-group"></div>';
				    if (angular.isDefined(attrs.filterable) || angular.isDefined(attrs.title)
					    || angular.isDefined(attrs.header)) {
					tpl = $templateCache.get('panel-list-group.html');
				    }
				    return tpl;
				},
				controller : [ '$scope', '$parse', '$filter', 'comparatorFactory', ListGroupCtrl ],
				scope : {
				    items : '=',
				    selectable : '@',
				    filterable : '@',
				    selectionChange : '@',
				    contextualClass : '@',
				    disabled : '@',
				    title : '@',
				    panel : '@'
				},
				link : function(scope, element, attrs) {
				    scope.$$items = scope.items;
				    scope.multiSelection = (attrs['selectable'] == 'multiple');

				    scope.$$isSelectable = function() {
					var values = [ 'true', 'single', 'multiple' ];
					return values.indexOf(scope.selectable) > -1;
				    }

				    scope.$displayHeading = function() {
					return angular.isDefined(scope.title);
				    }

				    var promise = resolveInnerHTML(scope, attrs);
				    promise.then(function(html) {
					var cellElement = angular.element(html);
					element.append(cellElement);
					$compile(element)(scope);
				    });

				    var filterable = scope.$eval(attrs['filterable']);
				    if (angular.isObject(filterable)) {
					scope.filterable = angular.extend(scope.filter, filterable);
				    }

				}
			    }
			} ]);