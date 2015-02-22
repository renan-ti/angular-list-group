(function(window, document) {
'use strict';
function isPromise(obj) {
    var promise = false;
    if (obj && obj.then && angular.isFunction(obj.then)) {
	promise = true;
    }
    return promise;
}

var angularListGroupServices = angular.module('angularListGroup.services', []);
var angularListGroupDirectives = angular.module('angularListGroup.directives', []);
var angularListGroupFilters = angular.module('angularListGroup.filters', []);

angular.module('listGroup', [ 'angularListGroup.services', 'angularListGroup.filters', 'angularListGroup.directives' ]);
angularListGroupFilters.filter('listGroupItemContextualClass', function() {
    return function(value) {
	var clazz = '';
	var acceptedValues = [ 'success', 'info', 'warning', 'danger' ];
	if (acceptedValues.indexOf(value) > -1) {
	    clazz = 'list-group-item-' + value;
	} else if (angular.isDefined(value)) {
	    clazz = '{{$evalContextualClass(item)}}'
	}
	return clazz;
    };
});

angularListGroupFilters.filter('startsWith', function($filter) {
    return function(str, starts, ignoreCase) {
	var comparator = function(str, starts) {
	    if (starts === '') {
		return true;
	    }
	    if (str == null || starts == null) {
		return false;
	    }
	    str = String(str);
	    starts = String(starts);
	    return str.length >= starts.length && str.slice(0, starts.length) === starts;
	}
	return $filter('compare')(str, starts, comparator, ignoreCase);
    }
});
angularListGroupFilters.filter('eq', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, text) {
	    return angular.equals(str, text);
	};
	return $filter('compare')(str, text, comparator, ignoreCase);
    }
});
angularListGroupFilters.filter('neq', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, text) {
	    return !angular.equals(obj, text)
	}
	return $filter('compare')(str, text, comparator, ignoreCase);
    }
});

angularListGroupFilters.filter('endsWith', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, ends) {
	    if (ends === '') {
		return true;
	    }
	    if (str == null || ends == null) {
		return false;
	    }
	    str = String(str);
	    ends = String(ends);
	    return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
	};
	return $filter('compare')(str, ends, comparator, ignoreCase);
    }
});
angularListGroupFilters.filter('contains', function($filter) {
    return function(str, contains, ignoreCase) {
	var comparator = function(str, contains) {
	    return str.indexOf(contains) > -1;
	}
	return $filter('compare')(str, contains, comparator, ignoreCase);
    }
});

angularListGroupFilters.filter('compare', function() {
    return function(obj, text, comparator, ignoreCase) {
	if (text === '')
	    return true;
	if (obj == null || text == null)
	    return false;

	var match = false;
	if (obj && text && typeof obj === 'object' && typeof text === 'object') {
	    for ( var objKey in obj) {
		if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey)
			&& comparator(obj[objKey], text[objKey])) {
		    match = true;
		    break;
		}
	    }
	} else {
	    if (ignoreCase) {
		text = ('' + text).toLowerCase();
		obj = ('' + obj).toLowerCase();
	    }
	    match = comparator(obj, text);
	}
	return match;
    }
});
angularListGroupServices.factory('comparatorFactory', [
	'$parse',
	function($parse) {

	    var $$startsWith = function(str, starts) {
		if (starts === '')
		    return true;
		if (str == null || starts == null)
		    return false;
		str = String(str);
		starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;
	    };

	    var $$endsWith = function(str, ends) {
		if (ends === '')
		    return true;
		if (str == null || ends == null)
		    return false;
		str = String(str);
		ends = String(ends);
		return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
	    };

	    var factory = {};

	    /**
	     * 
	     */
	    factory.eq = function(obj, text) {
		factory.eq.ignoreCase;
		return factory.$compare(obj, text, function(obj, text) {
		    return angular.equals(obj, text);
		}, factory.eq.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.neq = function(obj, text) {
		if (text === '')
		    return true;
		if (obj == null || text == null)
		    return false;
		return !factory.eq(obj, text);
	    };
	    /**
	     * 
	     */
	    factory.startswith = function(obj, text) {
		factory.startswith.ignoreCase;
		return factory.$compare(obj, text, $$startsWith, factory.startswith.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.endswith = function(obj, text) {
		factory.endswith.ignoreCase;
		return factory.$compare(obj, text, $$endsWith, factory.endswith.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.contains = function(obj, text) {
		factory.contains.ignoreCase;
		return factory.$compare(obj, text, function(str, text) {
		    return str.indexOf(text) > -1;
		}, factory.contains.ignoreCase);
	    };

	    /**
	     * 
	     */
	    factory.$compare = function(obj, text, comparator, ignoreCase) {
		if (text === '')
		    return true;
		if (obj == null || text == null)
		    return false;

		var match = false;
		if (obj && text && typeof obj === 'object' && typeof text === 'object') {
		    for ( var objKey in obj) {
			if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey)
				&& comparator(obj[objKey], text[objKey])) {
			    match = true;
			    break;
			}
		    }
		} else {
		    if (ignoreCase) {
			text = ('' + text).toLowerCase();
			obj = ('' + obj).toLowerCase();
		    }
		    match = comparator(obj, text);
		}
		return match;
	    }

	    return factory;
	} ]);
angularListGroupServices.factory('listGroupComponentFactory', function($templateCache) {

    var SIZE_CLASSNAME_MAP = {
	'small' : 'input-group-sm',
	'large' : 'input-group-lg'
    };

    return {
	resolveSizeClassName : function(size) {
	    var classname;
	    if (angular.isDefined(SIZE_CLASSNAME_MAP[size])) {
		classname = SIZE_CLASSNAME_MAP[size];
	    }
	    return classname;
	},
	createPanelBody : function() {
	    return angular.element('<div class="panel-body"></div>');
	},
	createInputGroup : function() {
	    return angular.element('<div class="input-group-btn"></div>');
	},
	createButton : function(glyphiconClassName) {
	    var btn = angular.element('<button class="btn btn-default"></button>');
	    var icon = this.createIcon(glyphiconClassName);
	    if (icon != null) {
		btn.append(icon);
	    }
	    return btn;
	},
	createIcon : function(glyphiconClassName) {
	    var elt = null;
	    if (angular.isDefined(glyphiconClassName)) {
		elt = angular.element('<span class="glyphicon ' + glyphiconClassName + '"></span>');
	    }
	    return elt;
	},
	addHasError : function(elt) {
	    angular.element(elt).addClass('has-error');
	},
	/**
	 * Returns <code>true</code> if the panel element has a body,
	 * <code>false</code> otherwise
	 * 
	 * @param panel
	 * @returns <code>true</code> if the panel element has a body,
	 *          <code>false</code> otherwise
	 */
	hasBody : function(panel) {
	    var hasBody = false;
	    var children = panel.children();
	    for ( var i = 0; i < children.length; i++) {
		var child = children[i];
		if (hasBody = angular.element(child).hasClass("panel-body")) {
		    break;
		}
	    }
	    return hasBody;
	}
    }

});
angularListGroupServices.factory('listGroupPanelWrapper', [ '$templateCache', '$animate',
	function($templateCache, $animate) {

	    return {
		$$panel : null,
		$$inlineEditionform : null,

		wrap : function(elt) {
		    this.$$panel = elt;
		    return this;
		},

		appendInlineCreateForm : function(comp) {
		    if (!this.$$inlineEditionform) {
			this.$$inlineEditionform = comp;
			var children = angular.element(this.$$panel).children();
			for ( var i = 0; i < children.length; i++) {
			    var child = angular.element(children[i]);
			    if (child.hasClass('panel-heading') || child.hasClass('panel-body')) {
				var container = angular.element('<div></div>');
				child.after(container);
				$animate.enter(comp, container).then(function() {
				});
				break;
			    }
			}
		    }
		    return this;
		},
		removeInlineCreateForm : function() {
		    var removed = false;
		    var that = this;
		    if (this.$$inlineEditionform != null) {
			var container = this.$$inlineEditionform.parent();
			$animate.leave(this.$$inlineEditionform).then(function() {
			    container.remove();
			    that.$$inlineEditionform = null;
			});
		    }
		    return removed;
		},
		focusInlineCreateForm : function() {
		    if (this.$$inlineEditionform != null && this.$$inlineEditionform.find('input')[0]) {
			this.$$inlineEditionform.find('input')[0].focus();
		    }
		    return this;
		},
		setInlineCreateFormOnError : function() {
		    this.$$inlineEditionform.addClass('has-error');
		}
	    }

	} ]);
var ListGroupCtrl = [
	'$scope',
	'$attrs',
	'$parse',
	'$filter',
	'$sce',
	'$compile',
	function($scope, $attrs, $parse, $filter, $sce, $compile) {

	    var ctrl = this;

	    var defaultBeforeSelectionChange = function(item) {
		return true;
	    };

	    ctrl.$$items = [];
	    angular.extend(ctrl.$$items, $scope.items);

	    ctrl.$$selectedItems = [];

	    ctrl.filter = {
		text : '',
		comparator : 'contains',
		ignoreCase : true,
		placeholder : '',
		auto : true
	    };

	    if ($attrs.filterable && angular.isObject($scope.filterable)) {
		angular.extend(ctrl.filter, $scope.filterable);
	    }

	    ctrl.beforeSelectionChange = (!$attrs.beforeSelectionChange) ? defaultBeforeSelectionChange
		    : $scope.beforeSelectionChange;
	    ctrl.afterSelectionChange = (!$attrs.afterSelectionChange) ? angular.noop : $scope.afterSelectionChange;

	    ctrl.$selectItem = function(item) {
		var idx = -1;
		if ((idx = ctrl.isSelected(item)) > -1) {
		    ctrl.$$selectedItems.splice(idx, 1);
		} else {
		    if (!($attrs.selectable == 'multiple')) {
			ctrl.$$selectedItems.length = 0;
		    }
		    ctrl.$$selectedItems.push(item);
		}
	    };

	    ctrl.select = function(item) {
		if (!ctrl.isDisabled(item)) {
		    var output = ctrl.beforeSelectionChange({
			item : item
		    });
		    if (angular.isUndefined(output)) {
			throw new Error(
				"'beforeSelectionChange' returned undefined as value! Check the binding or the returned value");
		    }
		    if (output) {
			if (angular.isFunction(output.then)) {
			    output.then(function(returnedValue) {

				if (returnedValue === true) {
				    ctrl.$selectItem(item);
				    ctrl.afterSelectionChange({
					item : item
				    });
				}
			    });
			} else if (output === true) {
			    ctrl.$selectItem(item);
			    ctrl.afterSelectionChange({
				item : item
			    });
			}
		    }
		}
	    }

	    ctrl.isSelected = function(item) {
		var idx = -1;
		for ( var i = 0, len = ctrl.$$selectedItems.length; i < len; i++) {
		    if (item === ctrl.$$selectedItems[i]) {
			idx = i;
			break;
		    }
		}
		return idx;
	    };

	    ctrl.resolveContextualClass = function(item) {
		var clazz = $scope.contextualClass;
		if ($attrs.contextualClass) {
		    var fn = $parse($attrs.contextualClass);
		    if (angular.isFunction(fn)) {
			var val = fn($scope.$parent, {
			    item : item
			});
			if (val) {
			    clazz = val;
			}
		    }
		}
		return clazz;
	    }

	    /**
	     * Returns <code>true</code> if the specified item if disabled,
	     * <code>false</code> otherwise
	     */
	    ctrl.isDisabled = function(item) {
		var disabled = false;
		if ($attrs.disabled) {
		    if ($scope.disabled === true) {
			disabled = $scope.disabled;
		    } else {
			var fn = $parse($attrs.disabled);
			if (angular.isFunction(fn)) {
			    disabled = fn($scope.$parent, {
				item : item
			    });
			}
		    }
		}
		return disabled;
	    };

	    /**
	     * 
	     */
	    ctrl.executeFilter = function() {
		ctrl.$$items = $filter('filter')($scope.items, ctrl.filter.text, ctrl.filter.comparator);
	    };

	    ctrl.clearFilter = function() {
		ctrl.filter.text = '';
		ctrl.$$items = $scope.items;
	    }

	    $scope.compare = function(actual, expected) {
		var match = true;
		if (ctrl.filter.auto === true) {
		    match = $filter(ctrl.filter.comparator)(actual, expected, ctrl.filter.ignoreCase);
		}
		return match;
	    };

	    var removeSelectedItemsListener = $scope.$watchCollection('listGroupCtrl.$$selectedItems', function(
		    newValue, oldValue) {
		if ($scope.selectedItems) {
		    $scope.selectedItems = newValue;
		}
	    });

	    $scope.$on('$destroy', function() {
		removeSelectedItemsListener();
	    });

	} ];

angularListGroupDirectives.directive('listGroup', [ '$templateCache', function($templateCache) {
    return {
	restrict : 'EA',
	replace : true,
	template : function(elem, attrs) {
	    var templateName = 'list-group.tpl.html';
	    if ('selectable' in attrs) {
		templateName = 'linked-list-group.tpl.html';
	    }
	    if ('filterable' in attrs || 'header' in attrs) {
		templateName = 'panel-list-group.tpl.html';
	    }
	    return $templateCache.get(templateName);
	},
	controller : ListGroupCtrl,
	controllerAs : 'listGroupCtrl',
	scope : {
	    items : '=',
	    labelFn : '@?',
	    selectedItems : '=?',
	    beforeSelectionChange : '&?',
	    afterSelectionChange : '&?',
	    disabled : '@?',
	    contextualClass : '@?',
	    filterable : '=?',
	    selectable : '@?',
	    template : '=?',
	    templateUrl : '=?',
	    header : '=?'
	}
    };
} ]);

angularListGroupDirectives.directive('listGroupItemContent', [ '$compile', '$templateRequest',
	function($compile, $templateRequest) {
	    return {
		restrict : 'EA',
		replace : true,
		scope : true,
		controller : function($scope, $attrs, $parse) {
		    var ctrl = this;
		    ctrl.resolveLabel = function(item) {
			var label = item;
			if ($scope.labelFn) {
			    var fn = $parse($scope.labelFn);
			    // item ng-repeat scope
			    var targetScope = $scope.$parent;
			    // listGroup directive scope
			    targetScope = targetScope.$parent;
			    // Client Ctrl scope
			    targetScope = targetScope.$parent;
			    label = fn(targetScope, {
				item : item
			    });

			} else if (item.label) {
			    label = item.label;
			} else if (angular.isObject(item)) {
			    label = angular.toJson(item);
			}
			return label;
		    };
		},
		controllerAs : 'ctrl',
		compile : function(tElement, tAtrrs) {
		    return function(scope, element, attrs, ctrl) {
			var html;
			if (scope.templateUrl) {
			    $templateRequest(scope.templateUrl).then(function(html) {
				element.replaceWith($compile(html)(scope));
			    });
			} else if (scope.template) {
			    element.replaceWith($compile(scope.template)(scope));
			} else {
			    element.replaceWith(ctrl.resolveLabel(scope.item));
			}
		    }
		}
	    }
	} ]);

angularListGroupDirectives.directive('listGroupHtml', function() {
    return {
	restrict : 'EA',
	replace : true,
	terminal : true,
	scope : false,
	templateUrl : 'list-group.tpl.html'
    }
});

angularListGroupDirectives.directive('linkedListGroupHtml', function() {
    return {
	restrict : 'EA',
	replace : true,
	terminal : true,
	scope : false,
	templateUrl : 'linked-list-group.tpl.html'
    }
});

angularListGroupDirectives.directive('listGroupFilter', function() {
    return {
	restrict : 'EA',
	replace : true,
	terminal : true,
	scope : false,
	templateUrl : 'list-group-filter.tpl.html'
    }
});

angularListGroupDirectives.directive('panelListGroupTitle', function() {
    return {
	restrict : 'EA',
	replace : true,
	terminal : true,
	scope : false,
	templateUrl : 'panel-list-group-title.tpl.html',
	compile : function(tElement, tAtrrs) {
	    return function(scope, element, attrs, listGroupCtrl) {
		if (angular.isString(scope.header)) {
		    scope.title = scope.header;
		}
	    }
	}
    }
});

var ListGroupEditorCtrl = [ '$scope', '$attrs', '$parse', '$filter', '$sce', '$compile', '$injector', '$timeout',
	function($scope, $attrs, $parse, $filter, $sce, $compile, $injector, $timeout) {

	    var ctrl = this;

	    var listGroupCtrl = $injector.instantiate(ListGroupCtrl, {
		$scope : $scope,
		$attrs : $attrs,
		$parse : $parse,
		$filter : $filter,
		$sce : $sce,
		$compile : $compile
	    });

	    angular.extend(ctrl, listGroupCtrl);

	    var editAction = {
		icon : 'fa-pencil-square-o',
		fn : function(item) {
		    ctrl.$$onEdit(item);
		},
		disabled : angular.noop,
		builtin : true
	    };

	    var deleteAction = {
		icon : 'fa-trash-o',
		fn : function(item) {
		    ctrl.$$onDelete(item);
		},
		disabled : angular.noop
	    };

	    var title = $attrs.title ? $parse($attrs.title)($scope.$parent) : '&nbsp;';
	    ctrl.title = $sce.trustAsHtml(title);

	    ctrl.$$itemActions = [];

	    if ('itemActions' in $attrs) {
		ctrl.$$itemActions = $scope.itemActions;
	    } else {
		if (!$attrs.editable || ($attrs.editable !== 'false')) {
		    ctrl.$$itemActions.push(editAction);
		}
		if (!$attrs.deletable || ($attrs.deletable !== 'false')) {
		    ctrl.$$itemActions.push(deleteAction);
		    deleteAction.disabled = $parse($attrs.deletable);
		}
	    }
	    ctrl.$$invokeAction = function(action, item) {
		 action.fn(item);
	    }

	    ctrl.$$onAdd = function() {
		if ('onAdd' in $attrs) {
		    var output = $scope.onAdd();
		    if (isPromise(output)) {
			output.then(function(newItem) {
			    ctrl.$$items.push(newItem);
			});
		    }
		}
	    }

	    ctrl.$$onDelete = function(item) {
		if ('onDelete' in $attrs) {
		    var output = $scope.onDelete({
			item : item
		    });
		    if (isPromise(output)) {
			output.then(function(itemToRemove) {
			    var idx = ctrl.$$items.indexOf(itemToRemove);
			    if (idx > -1) {
				ctrl.$$items.splice(idx, 1);
			    }
			});
		    }
		}
	    }

	    ctrl.$$onEdit = function(item) {
		if ('onEdit' in $attrs) {
		    var output = $scope.onEdit({
			item : angular.copy(item)
		    });
		    if (isPromise(output)) {
			output.then(function(editedItem) {
			    var idx = ctrl.$$items.indexOf(item);
			    if (idx > -1) {
				ctrl.$$items[idx] = editedItem;
				$timeout(function() {
				    $scope.$digest();
				})
			    }
			});
		    }
		}
	    }

	    ctrl.isActionDisabled = function(item, action) {
		var returnedValue = undefined;
		if (action.disabled) {
		    returnedValue = action.disabled($scope.$parent, {
			item : item
		    });
		}
		return returnedValue === false;
	    }

	} ];

angularListGroupDirectives.directive('listGroupEditor', [ '$templateCache', function($templateCache) {
    return {
	restrict : 'EA',
	replace : true,
	templateUrl : 'panel-editable-list-group.tpl.html',
	controller : ListGroupEditorCtrl,
	controllerAs : 'ctrl',
	scope : {
	    items : '=',
	    labelFn : '@?',
	    selectedItems : '=?',
	    beforeSelectionChange : '&?',
	    afterSelectionChange : '&?',
	    disabled : '@?',
	    contextualClass : '@?',
	    filterable : '=?',
	    selectable : '@?',
	    template : '=?',
	    templateUrl : '=?',
	    header : '=?',
	    onAdd : '&?',
	    onDelete : '&?',
	    onEdit : '&?',
	    itemActions : '=?'
	}
    };
} ]);
angular.module('listGroup').run(['$templateCache', function($templateCache) {
$templateCache.put('edit-inline-input.tpl.html',
    "<div class=\"input-group\"><input type=\"text\" class=\"form-control\" ng-model=\"$$model.editedValue\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"$inlineEdition.update()\"><span class=\"glyphicon glyphicon-ok\"></span></button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"$inlineEdition.cancel()\"><span class=\"glyphicon glyphicon-remove\"></span></button></span></div>"
  );


  $templateCache.put('linked-list-group.tpl.html',
    "<div class=\"list-group\"><a ng-href=\"\" class=\"list-group-item {{listGroupCtrl.resolveContextualClass(item)}}\" ng-repeat=\"item in listGroupCtrl.$$items | filter:listGroupCtrl.filter.text:compare track by $index\" ng-class=\"{active : (listGroupCtrl.isSelected(item) != -1), disabled : listGroupCtrl.isDisabled(item) }\" ng-click=\"listGroupCtrl.select(item)\"><list-group-item-content></list-group-item-content></a></div>"
  );


  $templateCache.put('list-group-filter.tpl.html',
    "<div><div class=\"input-group\" ng-if=\"listGroupCtrl.filter.auto === false\"><input type=\"text\" class=\"form-control\" placeholder=\"{{listGroupCtrl.filter.placeholder}}\" ng-model=\"listGroupCtrl.filter.text\"><div class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"listGroupCtrl.clearFilter(listGroupCtrl.filter.text)\" ng-disabled=\"!listGroupCtrl.filter.text\"><i class=\"glyphicon glyphicon-remove\"></i></button> <button class=\"btn btn-default\" ng-click=\"listGroupCtrl.executeFilter(listGroupCtrl.filter.text)\" ng-disabled=\"!listGroupCtrl.filter.text\"><i class=\"glyphicon glyphicon-search\"></i></button></div></div><input type=\"text\" class=\"form-control\" ng-model=\"listGroupCtrl.filter.text\" placeholder=\"{{listGroupCtrl.filter.placeholder}}\" ng-if=\"listGroupCtrl.filter.auto === true\"></div>"
  );


  $templateCache.put('list-group.tpl.html',
    "<ul class=\"list-group\"><li class=\"list-group-item {{listGroupCtrl.resolveContextualClass(item)}}\" ng-repeat=\"item in listGroupCtrl.$$items | filter:listGroupCtrl.filter.text:compare track by $index\"><list-group-item-content></list-group-item-content></li></ul>"
  );


  $templateCache.put('panel-editable-list-group.tpl.html',
    "<div class=\"panel panel-default\" ng-cloak=\"\"><div class=\"panel-heading\"><h3 class=\"panel-title\"><span ng-bind-html=\"::ctrl.title\"></span> <a ng-click=\"ctrl.$$onAdd()\"><i class=\"fa fa-plus-square-o pull-right\"></i></a></h3></div><div class=\"panel-body\" ng-if=\"filterable\"><list-group-filter></list-group-filter></div><ul class=\"list-group list-group-input-group\"><li class=\"list-group-item\" ng-repeat=\"item in ctrl.$$items | filter:ctrl.filter.text:compare\"><div class=\"input-group\"><!--       <input type=\"text\" class=\"form-control\" placeholder=\"Search for...\"> --><div class=\"form-control-static\"><list-group-item-content></list-group-item-content></div><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\" ng-disabled=\"ctrl.isActionDisabled(item, action)\" ng-repeat=\"action in ctrl.$$itemActions track by $index\" ng-click=\"ctrl.$$invokeAction(action, item)\"><i class=\"fa {{::action.icon}}\"></i></button></span></div></li></ul></div>"
  );


  $templateCache.put('panel-list-group-title.tpl.html',
    "<h3 class=\"panel-title\" ng-bind=\"::title\"></h3>"
  );


  $templateCache.put('panel-list-group.tpl.html',
    "<div class=\"panel panel-default\" ng-cloak=\"\"><div class=\"panel-heading\" ng-if=\"header\"><panel-list-group-title></panel-list-group-title></div><div class=\"panel-body\" ng-if=\"filterable\"><list-group-filter></list-group-filter></div><list-group-html ng-if=\"!selectable\"></list-group-html><linked-list-group-html ng-if=\"selectable\"></linked-list-group-html><!-- \t<div class=\"panel-footer\" ng-if=\"$displayFooter()\" --><!-- \t\tng-bind-html=\"footer\"></div> --></div>"
  );

}]);

})(window, document);
