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

angularListGroupDirectives.value('selectableListGroupTpl', 'selectable-list-group.html').value('listGroupTpl',
	'list-group.html').directive('selectableListGroupTemplate', function(selectableListGroupTpl) {
    return {
	replace : true,
	restrict : 'E',
	templateUrl : selectableListGroupTpl
    };
}).directive('listGroupTemplate', function(listGroupTpl) {
    return {
	replace : true,
	restrict : 'E',
	templateUrl : listGroupTpl
    };
}).directive(
	'listGroup',
	[
		'$parse',
		'$compile',
		'$interpolate',
		'selectableListGroupTpl',
		'listGroupTpl',
		function($parse, $compile, $interpolate, selectableListGroupTpl, listGroupTpl) {

		    var ListGroupCtrl = [
			    '$scope',
			    '$parse',
			    '$filter',
			    'comparatorFactory',
			    function($scope, $parse, $filter, comparatorFactory) {

				$scope.selectedItems = [];

				$scope.filter = {
				    text : '',
				    placeholder : 'Search...',
				    autoFilter : true,
				    ignoreCase : false
				}

				// displayed items list
				$scope.$items;

				$scope.selectItem = function(item) {
				    var idx = -1;
				    if ((idx = $scope.isSelected(item)) > -1) {
					$scope.selectedItems.splice(idx, 1);
				    } else {
					if ($scope.selectedItems.length > 0 && !$scope.multiSelection == true) {
					    $scope.selectedItems.length = 0;
					}
					$scope.selectedItems.push(item);
				    }
				}

				$scope.isSelected = function(item) {
				    var idx = -1;
				    for ( var i = 0, len = $scope.selectedItems.length; i < len; i++) {
					if (item === $scope.selectedItems[i]) {
					    idx = i;
					    break;
					}
				    }
				    return idx;
				}

				$scope.clearFilter = function() {
				    $scope.filter.text = '';
				}

				$scope.$filter = function() {
				    var comparator;
				    if (angular.isDefined($scope.filter.operator)) {
					comparator = comparatorFactory[$scope.filter.operator];
					comparator.ignoreCase = $scope.filter.ignoreCase;
				    }
				    $scope.$items = $filter('filter')($scope.items, $scope.filter.text, comparator);
				}
				/**
				 * 
				 */
				$scope.resolveInnerHTML = function(item) {
				    var html;
				    if (angular.isString(item)) {
					html = item;
				    } else if (angular.isDefined($scope.template)) {
					var tpl = $scope.$parent.$eval($scope.template);
					var ctx = $scope.$new();
					ctx.item = item;
					html = $interpolate(tpl)(ctx);
				    } else {
					html = angular.toJson(item);
				    }
				    return html;
				};

				// $http.get(t, {
				// cache: $templateCache
				// })
				// .success(function(data){
				// $templateCache.put(uKey, data);
				// p.resolve();
				// })
				// .error(function(err){
				// p.reject("Could not load template: " + t);
				// });

				var unbindselectionChangeWatcher = $scope.$watch('selectedItems', function(newVal,
					oldVal) {
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
				    unbindselectionChangeWatcher();
				    unbindFilterWatcher();
				});

			    } ];

		    var isSelectable = function(value) {
			var selectable = false;
			if (angular.isDefined(value)) {
			    selectable = (value == 'true') || (value == 'single') || (value == 'multiple');
			}
			return selectable;
		    };

		    var resolveTemplateName = function(selectable) {
			var tpl = listGroupTpl;
			if (isSelectable(selectable)) {
			    tpl = selectableListGroupTpl;
			}
			return tpl;
		    }

		    return {
			restrict : 'EA',
			terminal : true,
			replace : true,
			templateUrl : function(elem, attrs) {
			    var tpl;
			    if (angular.isDefined(attrs.filterable) && (attrs.filterable != 'false')) {
				tpl = "panel-list-group.html";
			    } else {
				tpl = resolveTemplateName(attrs.selectable);
			    }
			    return tpl;
			},
			controller : ListGroupCtrl,
			scope : {
			    items : '=',
			    selectable : '@',
			    filterable : '@',
			    selectionChange : '@',
			    template : '@'
			},
			link : function(scope, element, attrs) {
			    scope.$items = scope.items;
			    scope.multiSelection = (attrs['selectable'] == 'multiple');
			    scope.isSelectable = function() {
				return isSelectable(attrs['selectable']);
			    }
			    var filterable = scope.$eval(attrs['filterable']);
			    if (angular.isObject(filterable)) {
				scope.filterable = angular.extend(scope.filter, filterable);
			    }

			}
		    }
		} ]);