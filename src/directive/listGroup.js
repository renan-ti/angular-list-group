var ListGroupCtrl = [
	'$scope',
	'$attrs',
	'$parse',
	'$filter',
	function($scope, $attrs, $parse, $filter) {

	    var self = this;

	    var noOp = function(item) {
	    };

	    var defaultBeforeSelectionChange = function(item) {
		return true;
	    };

	    this.$$items = [];
	    angular.extend(this.$$items, $scope.items);

	    this.$$selectedItems = [];

	    this.filter = {
		text : '',
		comparator : 'contains',
		ignoreCase : true,
		placeholder : '',
		auto : true
	    };

	    if ($attrs.filterable && angular.isObject($scope.filterable)) {
		angular.extend(this.filter, $scope.filterable);
	    }

	    this.beforeSelectionChange = (!$attrs.beforeSelectionChange) ? defaultBeforeSelectionChange
		    : $scope.beforeSelectionChange;
	    this.afterSelectionChange = (!$attrs.afterSelectionChange) ? noOp : $scope.afterSelectionChange;

	    this.$selectItem = function(item) {
		var idx = -1;
		if ((idx = this.isSelected(item)) > -1) {
		    this.$$selectedItems.splice(idx, 1);
		} else {
		    if (!($attrs.selectable == 'multiple')) {
			this.$$selectedItems.length = 0;
		    }
		    this.$$selectedItems.push(item);
		}
	    };

	    this.select = function(item) {
		if (!this.isDisabled(item)) {
		    var output = this.beforeSelectionChange({
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
				    self.$selectItem(item);
				    self.afterSelectionChange({
					item : item
				    });
				}
			    });
			} else if (output === true) {
			    this.$selectItem(item);
			    this.afterSelectionChange({
				item : item
			    });
			}
		    }
		}
	    }

	    this.isSelected = function(item) {
		var idx = -1;
		for ( var i = 0, len = this.$$selectedItems.length; i < len; i++) {
		    if (item === this.$$selectedItems[i]) {
			idx = i;
			break;
		    }
		}
		return idx;
	    };

	    this.resolveLabel = function(item) {
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

	    this.resolveContextualClass = function(item) {
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
	    this.isDisabled = function(item) {
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
	    this.executeFilter = function() {
		this.$$items = $filter('filter')($scope.items, this.filter.text, this.filter.comparator);
	    };

	    this.clearFilter = function() {
		this.filter.text = '';
		this.$$items = $scope.items;
	    }

	    $scope.compare = function(actual, expected) {
		var match = true;
		if (self.filter.auto === true) {
		    match = $filter(self.filter.comparator)(actual, expected, self.filter.ignoreCase);
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
	    if ('filterable' in attrs) {
		templateName = 'filterable-list-group.tpl.html';
	    }
	    return $templateCache.get(templateName);
	},
	controller : ListGroupCtrl,
	controllerAs : 'listGroupCtrl',
	scope : {
	    items : '=',
	    selectedItems : '=?',
	    beforeSelectionChange : '&?',
	    afterSelectionChange : '&?',
	    disabled : '@?',
	    contextualClass : '@?',
	    filterable : '=?',
	    selectable : '@?'
	}
    };
} ]);

angularListGroupDirectives.directive('listGroupHtml', function() {
    return {
	restrict : 'EA',
	replace : true,
	scope : false,
	templateUrl : 'list-group.tpl.html'
    }
});

angularListGroupDirectives.directive('linkedListGroupHtml', function() {
    return {
	restrict : 'EA',
	replace : true,
	scope : false,
	templateUrl : 'linked-list-group.tpl.html'
    }
});
