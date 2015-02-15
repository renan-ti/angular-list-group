var ListGroupEditorCtrl = [ '$scope', '$attrs', '$parse', '$filter', '$sce', '$compile', '$injector',
	function($scope, $attrs, $parse, $filter, $sce, $compile, $injector) {

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

	    /**
	     * 
	     */
	    var defaultDeleteFn = function(item) {

	    };

	    var editAction = {
		icon : 'fa-pencil-square-o',
		fn : angular.noop,
		disabled : angular.noop
	    };
	    var deleteAction = {
		icon : 'fa-trash-o',
		fn : angular.noop,
		disabled : angular.noop
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

	    ctrl.isActionDisabled = function(item, action) {
		var returnedValue = action.disabled($scope.$parent, {
		    $item : item
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
	    header : '=?'
	}
    };
} ]);