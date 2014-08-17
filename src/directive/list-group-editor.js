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

var ListGroupEditorCtrl = function($scope, $parse, $filter, comparatorFactory) {

    new ListGroupCtrl($scope, $parse, $filter, comparatorFactory);

    this.$$actions = [];

    this.$$getActions = function() {
	return this.$$actions;
    }

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

    this.template;

    this.getTemplate = function() {
	if (angular.isUndefined(this.template) && $scope.template) {
	    this.template = $scope.$parent.$eval($scope.template);
	}
	return this.template;
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
			function($parse, $compile, $interpolate, $q, $http, $templateCache) {

			    return {
				restrict : 'EA',
				terminal : true,
				replace : true,
				template : function(elem, attrs) {
				    return $templateCache.get('panel-list-group.html');
				},
				controller : [ '$scope', '$parse', '$filter', 'comparatorFactory', ListGroupEditorCtrl ],
				scope : {
				    items : '=',
				    selectable : '@',
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
				    var itemElt = angular
					    .element('<list-input-group-item ng-repeat="item in items" ng-model="item"></list-input-group-item>');
				    if (scope.size) {
					itemElt.attr('size', scope.size);
				    }
				    element.append(itemElt);
				    $compile(element)(scope);
				}
			    }
			} ]);