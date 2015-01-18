var ListGroupCtrl = [ '$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
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
} ];

angularListGroupDirectives.directive('listGroup', [ '$templateCache', function($templateCache) {
    return {
	restrict : 'EA',
	replace : true,
	template : function(elem, attrs) {
	    var tpl = $templateCache.get('list-group.tpl.html');
	    return tpl;
	},
	controller : ListGroupCtrl,
	scope : {
	    items : '='
	}
    };
} ]);