angularListGroupDirectives.directive('listInputGroupItem', function() {

	var ACTION_EDIT = {
		'id' : 'edit',
		'icon' : 'glyphicon-edit',
		'label' : 'edit',
		'fn' : '$edit(item)'
	};

	var ACTION_VALIDATE = {
		'id' : 'validate',
		'icon' : 'glyphicon-ok',
		'label' : 'ok',
		'fn' : '$validate(item)'
	};

	var ACTION_CANCEL = {
		'id' : 'remove',
		'icon' : 'glyphicon-remove',
		'label' : 'ok',
		'fn' : '$cancel(item)'
	};
	var ACTION_DELETE = {
		'id' : 'delete',
		'icon' : 'glyphicon-trash',
		'label' : 'remove',
		'fn' : '$delete(item)'
	};

	var ListInputGroupItemCtrl = [
			'$scope',
			'$element',
			'$attrs',
			'$compile',
			'$interpolate',
			'$parse',
			'$sce',
			'$http',
			'$templateCache',
			'$timeout',
			function($scope, $element, $attrs, $compile, $interpolate, $parse,
					$sce, $http, $templateCache, $timeout) {

				/**
				 * 
				 */
				$scope.$$model = {
					selected : false,
					html : '',
					editing : false
				};

				/**
				 * item actions
				 */
				$scope.actions = [];
				/**
				 * Render options
				 */
				$scope.options = {
					action : {
						display : {
							label : false,
							icon : true
						}
					}
				};

				/**
				 * 
				 */
				$scope.init = function() {
					$scope.resolveActions();
					$scope.resolveOptions();

					if ($scope.hasAttribute('selectable')) {
						$scope.$watch('$$model.selected',
								$scope.selectionChange)
					}
				};

				/**
				 * 
				 */
				$scope.resolveInnerHTML = function(item) {
					var html = '';
					var item = $scope.ngModelCtrl.$modelValue;
					if ($scope.hasAttribute('template')) {
						var tpl = $scope.$eval($attrs['template']);
						var ctx = $scope.$new();
						ctx.item = item;
						html = $interpolate(tpl)(ctx);
					} else if ($scope.hasAttribute('templateUrl')) {
						var src = $scope.$eval($attrs['templateUrl']);
						if (src) {
							$http.get(src, {
								cache : $templateCache
							}).success(function(response) {
								var ctx = $scope.$new();
								ctx.item = item;
								html = $interpolate(response)(ctx);
								$scope.$$model.html = $sce.trustAsHtml(html);
							});
						}
					} else if (!angular.isString(item)) {
						html = angular.toJson(item, true);
					} else {
						html = item;
					}

					$scope.$$model.html = $sce.trustAsHtml(html);
				};

				/**
				 * Selection change handler
				 */
				$scope.selectionChange = function(newVal, oldVal) {
					$parse($attrs['selectable']).assign($scope, newVal);
				};

				/**
				 * 
				 */
				$scope.$click = function(fn) {
					if (angular.isString(fn)) {
						fn = $parse(fn);
					}
					var item = $scope.ngModelCtrl.$modelValue;
					fn($scope, {
						item : item
					});
				};

				/**
				 * Edit action handler
				 */
				$scope.$edit = function() {
					if ($scope.hasAttribute('inline')) {
						$scope.startInlineEdition();
					} else {
						if ($scope.hasAttribute('editFn')) {
							var editFn = $parse($attrs['editFn']);
							var item = $scope.ngModelCtrl.$modelValue;
							editFn($scope, {
								item : item
							});
						}
					}
				};
				$scope.$validate = function() {
					$scope.ngModelCtrl.$setViewValue($scope.$$model.html);
					$scope.ngModelCtrl.$render();
					$scope.endInlineEdition();

				};
				$scope.$cancel = function() {
					$scope.$$model.html = $scope.ngModelCtrl.$modelValue;
					$scope.ngModelCtrl.$render();
					$scope.endInlineEdition();
				};
				/**
				 * Delete action handler
				 */
				$scope.$delete = function() {
					if ($scope.hasAttribute('deleteFn')) {
						var deleteFn = $parse($attrs['deleteFn']);
						var item = $scope.ngModelCtrl.$modelValue;
						deleteFn($scope, {
							item : item
						});
					}
				};
				/**
				 * Returns <code>true</code> if the action is rendered as a
				 * button dropdowns
				 */
				$scope.isDropDown = function(action) {
					return angular.isDefined(action.actions);
				};

				/**
				 * Returns <code>true</code> if the selectable attribute is
				 * specified
				 */
				$scope.isSelectable = function() {
					return $scope.hasAttribute('selectable');
				}

				/**
				 * Returns <code>true</code> if the size attribute is set to
				 * 'large'
				 */
				$scope.isLarge = function() {
					return $scope.isSizeEquals('large');
				};

				/**
				 * Returns <code>true</code> if the size attribute is set to
				 * 'small'
				 */
				$scope.isSmall = function() {
					return $scope.isSizeEquals('small');
				};

				/**
				 * Returns <code>true</code> if the size attribute is equal to
				 * the specified value
				 */
				$scope.isSizeEquals = function(value) {
					var equals = false;
					if ($scope.hasAttribute('size')) {
						equals = ($attrs['size'] == value);
					}
					return equals;
				};

				$scope.resolveActions = function() {
					var actions = $scope.getAttributeAsObject('actions');
					if (angular.isDefined(actions) == true) {
						if (angular.isArray(actions)) {
							$scope.actions = actions;
						} else {
							$scope.actions.push(actions);
						}
					}
					if ($scope.hasAttribute('editable')) {
						$scope.actions.push(ACTION_EDIT);
					}
					if ($scope.hasAttribute('deletable')) {
						$scope.actions.push(ACTION_DELETE);
					}
				};

				$scope.resolveOptions = function() {
					if ($scope.hasAttribute('options')) {
						var opts = $scope.getAttributeAsObject('options');
						$scope.options = angular.extend(scope.options, opts);
					}
				};

				/**
				 * 
				 */
				$scope.startInlineEdition = function() {
					var tmp = [];
					angular.forEach($scope.actions, function(action) {
						if (action.id === ACTION_EDIT.id) {
							tmp.push(ACTION_VALIDATE);
							tmp.push(ACTION_CANCEL);
						} else {
							tmp.push(action);
						}
					});
					$scope.actions = tmp;
					$scope.$$model.editing = true;
					$timeout(function() {
						$element.find('input')[0].select();
					});
				}
				/**
				 * 
				 */
				$scope.endInlineEdition = function() {
					var tmp = [];
					angular.forEach($scope.actions, function(action) {
						if (action.id === ACTION_VALIDATE.id) {
							tmp.push(ACTION_EDIT);
						} else if (!(action.id === ACTION_CANCEL.id)) {
							tmp.push(action);
						}
					});
					$scope.actions = tmp;
					$scope.$$model.editing = false;
				}

				/**
				 * Returns the value of the attribute as an object.
				 */
				$scope.getAttributeAsObject = function(attrName) {
					var value = $attrs[attrName];
					if ($scope.hasAttribute(attrName)
							&& angular.isString(value)) {
						value = angular.fromJson(value);
					}
					return value;
				};

				/**
				 * Returns <code>true</code> an attribute with the specified
				 * name exists
				 */
				$scope.hasAttribute = function(attrName) {
					return angular.isDefined($attrs[attrName]) == true;
				};

			} ];

	return {
		restrict : 'EA',
		terminal : true,
		replace : true,
		templateUrl : 'list-input-group-item.html',
		require : [ 'ngModel' ],
		scope : true,
		controller : ListInputGroupItemCtrl,
		link : function(scope, element, attrs, ctrls) {
			scope.ngModelCtrl = ctrls[0];
			if (!scope.ngModelCtrl)
				return;
			scope.ngModelCtrl.$render = function() {
				scope.resolveInnerHTML(this.$modelValue);
			}
			scope.init();
		}
	}

});