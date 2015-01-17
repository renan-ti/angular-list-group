angularListGroupDirectives.directive('listGroup', ['$templateCache', function($templateCache) {
    return {
	restrict : 'EA',
	replace : true,
	template : function(elem, attrs) {
	    var tpl = $templateCache.get('list-group.tpl.html');
	    return tpl;
	},
	scope : {
	    items : '='
	}
    };
}]);