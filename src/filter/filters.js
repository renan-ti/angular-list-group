'use strict';

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