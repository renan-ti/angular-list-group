angularListGroupDirectives.directive('listInputGroupItem', function($compile, $parse, $templateCache) {

    var ListInputGroupItemCtrl = [ '$scope', '$element', '$attrs', '$compile', '$interpolate', '$parse', '$sce',
	    '$http', '$templateCache', '$timeout',
	    function($scope, $element, $attrs, $compile, $interpolate, $parse, $sce, $http, $templateCache, $timeout) {

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
		    if (angular.isDefined(fn)) {
			if (angular.isString(fn)) {
			    fn = $parse(fn);
			}
			fn($scope, {
			    $item : $scope.ngModelCtrl.$modelValue
			});
		    }
		    // $scope.$parent.$$invoke(fn, {
		    // $item : item
		    // });

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

		// $scope.resolveOptions = function() {
		// if ($scope.hasAttribute('options')) {
		// var opts = $scope.getAttributeAsObject('options');
		// $scope.options = angular.extend(scope.options, opts);
		// }
		// };

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
		    if ($scope.hasAttribute(attrName) && angular.isString(value)) {
			value = angular.fromJson(value);
		    }
		    return value;
		};

		var sizeClassnameMap = {
		    'small' : 'input-group-sm',
		    'large' : 'input-group-lg'
		}

		this.resolveSizeClassname = function(size) {
		    return sizeClassnameMap[size];
		}

	    } ];

    return {
	restrict : 'EA',
	terminal : true,
	replace : true,
	template : '<div class="input-group list-input-group-item"></div>',
	// require : [ 'ngModel' ],
	require : [ 'listInputGroupItem', '^listGroupEditor', '^ngModel' ],
	scope : {
	    item : '=ngModel'
	},
	controller : ListInputGroupItemCtrl,
	compile : function(element, attrs) {
	    return function(scope, element, attrs, ctrls, transcludeFn) {
		console.log('listInputGroupItem::compile::pre');

		var listInputGroupItemCtrl = ctrls[0];
		var listGroupEditorCtrl = ctrls[1];
		scope.actions = listGroupEditorCtrl.$$getActions();

		var sizeClassname = listInputGroupItemCtrl.resolveSizeClassname(attrs.size);
		if (sizeClassname) {
		    element.addClass(sizeClassname);
		}
		if (attrs.selectable) {
		    var newElm = $compile($templateCache.get('checkbox-input-group-addon.html'))(scope);
		    element.append(newElm);
		}
		var tpl = listGroupEditorCtrl.getTemplate();
		if (tpl) {
		    var newElm = $compile('<span class="form-control">' + tpl + '</span>')(scope);
		    element.append(newElm);
		} else {
		    var html = '<span class="form-control">';
		    if (angular.isString(scope.item)) {
			html += scope.item;
		    } else {
			html += angular.toJson(scope.item);
		    }
		    html += '</span>';
		    var newElm = $compile(html)(scope);
		    element.append(newElm);
		}

		var actions = listGroupEditorCtrl.$$getActions();
		angular.forEach(actions, function(action) {
		    var inputGroup = angular.element('<div class="input-group-btn"></div>');
		    var btn = angular.element('<button class="btn btn-default"></button>');

		    var fn = $parse(action.fn);
		    btn.bind('click', function() {
			scope.$apply(function() {
			    // scope(listGroupEditor > ngRepeat >
			    // listInputGroupItem)
			    fn(scope.$parent.$parent.$parent, {
				$item : scope.item
			    });
			});
		    });

		    var icon = angular.element('<span class="glyphicon"></span>');
		    if (action.icon) {
			icon.addClass(action.icon);
		    }
		    btn.append(icon);
		    inputGroup.append(btn);
		    element.append(inputGroup);
		});
	    }
	}
    }

});