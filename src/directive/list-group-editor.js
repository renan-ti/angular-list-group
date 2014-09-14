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