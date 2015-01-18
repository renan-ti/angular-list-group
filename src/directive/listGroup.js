var ListGroupCtrl = [ '$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {

    $scope.$selectedItems = [];

    $scope.select = function(item) {
	// if (!$scope.$isDisabled(item)) {
	var idx = -1;
	if ((idx = $scope.isSelected(item)) > -1) {
	    $scope.$selectedItems.splice(idx, 1);
	} else {
	    if (!($attrs.selectable === 'multiple')) {
		$scope.$selectedItems.length = 0;
	    }
	    $scope.$selectedItems.push(item);
	}
	// }
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
    }

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
	    selectedItems : '='
	}
    };
} ]);