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
		disabled : angular.noop,
		builtin : true
	    };

	    ctrl.title = $sce.trustAsHtml('&nbsp');

	    ctrl.$$actions = [];

	    if (!$attrs.editable || ($attrs.editable !== 'false')) {
		ctrl.$$actions.push(editAction);
	    }

	    if (!$attrs.deletable || ($attrs.deletable !== 'false')) {
		ctrl.$$actions.push(deleteAction);
		deleteAction.disabled = $parse($attrs.deletable);
	    }

	    ctrl.$$invokeAction = function(action, item) {
		if (action.builtin) {
		    action.fn(item);
		} else {
		    action.fn($scope.parent, {
			item : item
		    });
		}
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
		var returnedValue = action.disabled($scope.$parent, {
		    item : item
		});
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
	    onEdit : '&?'
	}
    };
} ]);