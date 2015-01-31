(function(window, document) {
'use strict';
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
				    console.log("sdlkmfjqsmlkfjdsqlfj");
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
var ACTIONS = {
    'edit' : {
	'id' : '$$edit',
	'icon' : 'glyphicon-edit',
	'label' : 'edit'
    },
    'delete' : {
	'id' : '$$delete',
	'icon' : 'glyphicon-trash',
	'label' : 'remove'
    },
    'validate' : {
	'id' : '$$validate',
	'icon' : 'glyphicon-ok',
	'label' : 'ok',
	'fn' : '$validate(item)'
    },
    'cancel' : {
	'id' : 'remove',
	'icon' : 'glyphicon-remove',
	'label' : 'ok',
	'fn' : '$cancel(item)'
    }
};

var ListGroupEditorCtrl = function($scope, $parse, $filter, $templateCache, listGroupComponentFactory) {

    new ListGroupCtrl($scope, $parse, $filter);

    this.template;

    this.editTemplate;

    this.$$actions = [];

    this.getTemplate = function() {
	if (angular.isUndefined(this.template) && $scope.template) {
	    this.template = $scope.$parent.$eval($scope.template) || $scope.template;
	}
	return this.template;
    }

    this.getEditTemplate = function() {
	if (angular.isUndefined(this.editTemplate)) {
	    if (angular.isUndefined($scope.editTemplate)) {
		this.editTemplate = $templateCache.get('edit-inline-input.tpl.html');
	    } else {
		this.editTemplate = $scope.$parent.$eval($scope.editTemplate) || $scope.editTemplate;
	    }
	}
	return this.editTemplate;
    };

    this.isInlineEditionMode = function() {
	return $scope.editable == 'inline';
    };

    /**
     * 
     */
    this.updateItem = function(oldValue, newValue) {
	var updated = false;
	if (this.isNewValue(newValue)) {
	    for ( var i = 0, len = $scope.items.length; i < len; i++) {
		if ($scope.items[i] === oldValue) {
		    $scope.items[i] = newValue;
		    updated = true;
		}
	    }
	}
	return updated;
    };
    /**
     * Add a new item to the list of items
     * 
     * @param item
     *                item to add to the list of items
     */
    this.addItem = function(value) {
	var added = false;
	if (this.isNewValue(value)) {
	    $scope.items.push(value);
	    added = true;
	}
	return added;
    }

    this.isNewValue = function(newValue) {
	return (angular.isString(newValue) && $scope.items.indexOf(newValue) == -1);
    };

    this.$$getActions = function() {
	return this.$$actions;
    };

    this.$$resolveActions = function() {
	if ($scope.actions) {
	    var actions = angular.fromJson($scope.actions);
	    if (angular.isArray(actions)) {
		this.$$actions = actions;
	    } else if (angular.isObject(actions)) {
		this.$$actions.push(actions);
	    }
	}
	if ($scope.editable) {
	    var action = ACTIONS['edit'];
	    if ($scope.onEdit) {
		action.fn = $scope.onEdit
	    }
	    this.$$actions.push(action);
	}
	if ($scope.deletable) {
	    var action = ACTIONS['delete'];
	    if ($scope.onDelete) {
		action.fn = $scope.onDelete;
	    }
	    this.$$actions.push(action);
	}
    };

    $scope.isInlineEditionMode = function() {
	return $scope.editable == 'inline';
    }

    $scope.hasPanelHeading = function() {
	return angular.isDefined($scope.title) || $scope.isInlineEditionMode();
    }

};

angularListGroupDirectives
	.directive(
		'listGroupEditor',
		[
			'$parse',
			'$compile',
			'$interpolate',
			'$q',
			'$http',
			'$templateCache',
			'listGroupComponentFactory',
			'listGroupPanelWrapper',
			function($parse, $compile, $interpolate, $q, $http, $templateCache, componentFactory,
				panelWrapper) {

			    return {
				restrict : 'EA',
				terminal : true,
				replace : true,
				template : function(elem, attrs) {
				    return $templateCache.get('panel-list-group.html');
				},
				controller : ListGroupEditorCtrl,
				scope : {
				    items : '=',
				    selectable : '@',
				    onSelectionChange : '&',
				    filterable : '@',
				    selectionChange : '@',
				    contextualClass : '@',
				    disabled : '@',
				    title : '@',
				    panel : '@',

				    deletable : '@',
				    onDelete : '@',
				    editable : '@',
				    onEdit : '@',
				    actions : '@',
				    template : '@',
				    size : '@'
				},
				link : function(scope, element, attrs, ctrl) {
				    ctrl.$$resolveActions();

				    if (ctrl.isInlineEditionMode()) {
					var fn = scope.$resolvePanelClasses;
					scope.$resolvePanelClasses = function(item) {
					    return 'panel-toolbar ' + fn();
					}
				    }

				    var itemElt = angular
					    .element('<list-input-group-item ng-repeat="$$item in items" class="list-input-group-item"></list-input-group-item>');

				    var attNames = [ 'size', 'selectable' ];

				    angular.forEach(attNames, function(attName) {
					if (scope[attName]) {
					    itemElt.attr(attName, scope[attName]);
					}
				    });

				    // if (scope.size) {
				    // itemElt.attr('size', scope.size);
				    // }

				    element.append(itemElt);
				    $compile(element)(scope);

				    scope.$$model = {
					editedValue : null
				    };

				    scope.$inlineEdition = {
					cancel : function() {
					    panelWrapper.wrap(element).removeInlineCreateForm();
					},
					onCreate : function() {
					    if (!componentFactory.hasBody(element)) {
						var body = componentFactory.createPanelBody();
						body.addClass('inline-create-form');
						var comp = $compile(ctrl.getEditTemplate())(scope);
						body.append(comp);
						panelWrapper.wrap(element).appendInlineCreateForm(body)
							.focusInlineCreateForm();
					    }
					},
					update : function() {
					    var wrapper = panelWrapper.wrap(element);
					    if (ctrl.addItem(scope.$$model.editedValue)) {
						scope.$$model.editedValue = null;
						wrapper.removeInlineCreateForm();
					    } else {
						wrapper.setInlineCreateFormOnError();
					    }

					}
				    }

				}
			    }
			} ]);
angularListGroupDirectives.directive('listInputGroupItem', function($compile, $parse, $templateCache, $timeout,
	listGroupComponentFactory, $animate, $log) {

    var ListInputGroupItemCtrl = [ '$scope', '$element', '$attrs', '$compile', '$interpolate', '$parse', '$sce',
	    '$http', '$templateCache', '$timeout',
	    function($scope, $element, $attrs, $compile, $interpolate, $parse, $sce, $http, $templateCache, $timeout) {

		$scope.$$model = {
		    selected : false,
		    editedValue : null
		};

		/**
		 * Selection change handler
		 */
		$scope.$onSelectionChange = function() {
		    var selected = $scope.$$model.selected;
		    console.log('selected => ' + selected);
		};

		$scope.selectionChangeHandler = null;

		$scope.$watch('$$model.selected', function() {
		    if ($scope.selectionChangeHandler == null) {
			$scope.selectionChangeHandler = $scope.$onSelectionChange;
		    } else {
			$scope.$onSelectionChange();
		    }
		});

	    } ];

    return {
	restrict : 'EA',
	terminal : true,
	replace : true,
	template : '<div class="input-group list-input-group-item"></div>',
	require : [ 'listInputGroupItem', '^listGroupEditor' ],
	scope : false,
	controller : ListInputGroupItemCtrl,
	compile : function(element, attrs) {
	    return function(scope, element, attrs, ctrls, transcludeFn) {
		console.log('listInputGroupItem::compile::pre');

		var hiddenElementClassname = 'list-input-group-item-control-hidden';
		var editing = false;

		var listInputGroupItemCtrl = ctrls[0];
		var listGroupEditorCtrl = ctrls[1];

		scope.$inlineEdition = {
		    cancel : function() {
			endEditing();
		    },
		    update : function() {
			var oldValue = scope.$$item;
			var newValue = scope.$$model.editedValue;
			if (listGroupEditorCtrl.updateItem(oldValue, newValue)) {
			    endEditing();
			} else {
			    listGroupComponentFactory.addHasError(element.children()[0]);
			}
		    }
		}

		var sizeClassname = listGroupComponentFactory.resolveSizeClassName(attrs.size);
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
		    if (angular.isString(scope.$$item)) {
			html += scope.$$item;
		    } else {
			html += angular.toJson(scope.$$item);
		    }
		    html += '</span>';
		    var newElm = $compile(html)(scope);
		    element.append(newElm);
		}

		function beginEditing() {
		    if (!editing) {
			scope.$apply(function() {
			    editing = true;
			    scope.$$model.editedValue = scope.$$item;
			    var tpl = listGroupEditorCtrl.getEditTemplate();
			    var editElm = $compile(tpl)(scope);
			    var readElm = angular.element(element.children()[0]);
			    readElm.addClass(hiddenElementClassname);

			    $animate.enter(editElm, element).then(function() {
				$timeout(function() {
				    var elts = angular.element(editElm).find('input');
				    if (elts && elts[0]) {
					elts[0].focus();
					elts[0].select();
				    }
				});
			    });

			});
		    }
		}

		function endEditing() {
		    var promise = null;
		    if (editing) {
			var readElm = angular.element(element.children()[1]);
			var editElm = angular.element(element.children()[0]);
			promise = $animate.leave(editElm);
			promise.then(function() {
			    readElm.removeClass(hiddenElementClassname);
			    editing = false;
			    scope.$$model.editedValue = null;
			});
		    }
		    return promise;
		}

		function buildActions(actions, inlineEditionMode) {
		    angular.forEach(actions, function(action) {
			var inputGroup = listGroupComponentFactory.createInputGroup();
			var btn = listGroupComponentFactory.createButton(action.icon);
			var onClickFn = null;
			if (inlineEditionMode) {
			    onClickFn = beginEditing;
			} else {
			    var fn = $parse(action.fn);
			    onClickFn = function() {
				scope.$apply(function() {
				    fn(scope.$parent.$parent, {
					$item : scope.$$item
				    });
				});
			    };
			}
			btn.bind('click', onClickFn);
			inputGroup.append(btn);
			element.append(inputGroup);
		    });
		}

		buildActions(listGroupEditorCtrl.$$getActions(), listGroupEditorCtrl.isInlineEditionMode());

	    }
	}
    }

});
var ListGroupCtrl = [
	'$scope',
	'$attrs',
	'$parse',
	function($scope, $attrs, $parse) {

	    var noOp = function(item) {
	    };

	    var defaultBeforeSelectionChange = function(item) {
		return true;
	    };

	    $scope.$selectedItems = [];

	    $scope.beforeSelectionChange = (!$attrs.beforeSelectionChange) ? defaultBeforeSelectionChange
		    : $scope.beforeSelectionChange;
	    $scope.afterSelectionChange = (!$attrs.afterSelectionChange) ? noOp : $scope.afterSelectionChange;

	    $scope.select = function(item) {
		if (!$scope.isDisabled(item)) {
		    var output = $scope.beforeSelectionChange({
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
				    $scope.$selectItem(item);
				    $scope.afterSelectionChange({
					item : item
				    });
				}
			    });
			} else {
			    $scope.$selectItem(item);
			    $scope.afterSelectionChange({
				item : item
			    });
			}
		    }
		}
	    }

	    $scope.$selectItem = function(item) {
		var idx = -1;
		if ((idx = $scope.isSelected(item)) > -1) {
		    $scope.$selectedItems.splice(idx, 1);
		} else {
		    if (!($attrs.selectable == 'multiple')) {
			$scope.$selectedItems.length = 0;
		    }
		    $scope.$selectedItems.push(item);
		}
	    }

	    $scope.isSelected = function(item) {
		var idx = -1;
		for ( var i = 0, len = $scope.$selectedItems.length; i < len; i++) {
		    if (item === $scope.$selectedItems[i]) {
			idx = i;
			break;
		    }
		}
		return idx;
	    };

	    $scope.resolveLabel = function(item) {
		var label = item;
		if ($attrs.labelFn) {
		    var fn = $parse($attrs.labelFn);
		    label = fn($scope.$parent, {
			item : item
		    });
		} else if (item.label) {
		    label = item.label;
		}
		return label;
	    };
	    /**
	     * Returns <code>true</code> if the specified item if disabled,
	     * <code>false</code> otherwise
	     */
	    $scope.isDisabled = function(item) {
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

	    var removeSelectedItemsListener = $scope.$watchCollection('$selectedItems', function(newValue, oldValue) {
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
	    return $templateCache.get(templateName);
	},
	controller : ListGroupCtrl,
	scope : {
	    items : '=',
	    selectedItems : '=?',
	    beforeSelectionChange : '&?',
	    afterSelectionChange : '&?',
	    disabled : '@?'
	}
    };
} ]);
angular.module('listGroup').run(['$templateCache', function($templateCache) {
$templateCache.put('checkbox-input-group-addon.html',
    "<span class=\"input-group-addon\"><input type=\"checkbox\" ng-model=\"$$model.selected\"></span>"
  );


  $templateCache.put('edit-inline-input.tpl.html',
    "<div class=\"input-group\"><input type=\"text\" class=\"form-control\" ng-model=\"$$model.editedValue\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"$inlineEdition.update()\"><span class=\"glyphicon glyphicon-ok\"></span></button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"$inlineEdition.cancel()\"><span class=\"glyphicon glyphicon-remove\"></span></button></span></div>"
  );


  $templateCache.put('filter.tpl.html',
    "<div class=\"input-group\"><div input-filter=\"\"></div><div class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"$filter()\" ng-disabled=\"!filter\"><i class=\"glyphicon glyphicon-search\"></i></button></div></div>"
  );


  $templateCache.put('input-filter.tpl.html',
    "<input type=\"text\" class=\"form-control\" placeholder=\"{{filter.placeholder}}\" ng-model=\"filter.text\">"
  );


  $templateCache.put('linked-list-group.tpl.html',
    "<div class=\"list-group\"><a ng-href=\"\" class=\"list-group-item\" ng-repeat=\"item in items track by $index\" ng-class=\"{active : (isSelected(item) != -1), disabled : isDisabled(item) }\" ng-click=\"select(item)\">{{resolveLabel(item)}}</a></div>"
  );


  $templateCache.put('list-group.tpl.html',
    "<ul class=\"list-group\"><li class=\"list-group-item\" ng-class=\"resolveItemClass(item)\" data-ng-repeat=\"item in items track by $index\">{{resolveLabel(item)}}</li></ul>"
  );


  $templateCache.put('panel-list-group.html',
    "<div class=\"panel\" ng-class=\"$resolvePanelClasses()\" ng-cloak=\"\"><div class=\"panel-heading\" ng-if=\"hasPanelHeading\" ng-class=\"{'panel-heading-no-body' : !$isFilterable()}\"><h4 class=\"panel-title\"><span ng-bind=\"title\"></span><div class=\"btn-group btn-group-sm\" ng-if=\"editable == 'inline'\"><button class=\"btn btn-default\" ng-click=\"$inlineEdition.onCreate()\"><span class=\"glyphicon glyphicon-plus\"></span></button></div></h4></div><div class=\"panel-body\" ng-if=\"$isFilterable()\"><div class=\"input-group\" ng-if=\"!filter.autoFilter\"><input type=\"text\" class=\"form-control\" placeholder=\"{{filter.placeholder}}\" ng-model=\"filter.text\"><div class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"$filter()\" ng-disabled=\"!filter\"><i class=\"glyphicon glyphicon-search\"></i></button></div></div><input type=\"text\" class=\"form-control\" placeholder=\"{{filter.placeholder}}\" ng-model=\"filter.text\" ng-if=\"filter.autoFilter\"></div><div class=\"panel-footer\" ng-if=\"$displayFooter()\" ng-bind-html=\"footer\"></div></div>"
  );

}]);

})(window, document);