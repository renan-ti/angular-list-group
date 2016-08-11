'use strict';

listGroupFilters.filter('listGroupItemContextualClass', function() {
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

listGroupFilters.filter('startsWith', function($filter) {
    return function(str, starts, ignoreCase) {
	var comparator = function(str, starts) {
	    if (starts === '') {
		return true;
	    }
	    if (str == null || starts == null) {
		return false;
	    }
	    str = String(str);
	    starts = String(starts);
	    return str.length >= starts.length && str.slice(0, starts.length) === starts;
	}
	return $filter('compare')(str, starts, comparator, ignoreCase);
    }
});
listGroupFilters.filter('eq', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, text) {
	    return angular.equals(str, text);
	};
	return $filter('compare')(str, text, comparator, ignoreCase);
    }
});
listGroupFilters.filter('neq', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, text) {
	    return !angular.equals(obj, text)
	}
	return $filter('compare')(str, text, comparator, ignoreCase);
    }
});

listGroupFilters.filter('endsWith', function($filter) {
    return function(str, text, ignoreCase) {
	var comparator = function(str, ends) {
	    if (ends === '') {
		return true;
	    }
	    if (str == null || ends == null) {
		return false;
	    }
	    str = String(str);
	    ends = String(ends);
	    return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
	};
	return $filter('compare')(str, ends, comparator, ignoreCase);
    }
});
listGroupFilters.filter('contains', function($filter) {
    return function(str, contains, ignoreCase) {
	var comparator = function(str, contains) {
	    return str.indexOf(contains) > -1;
	}
	return $filter('compare')(str, contains, comparator, ignoreCase);
    }
});

listGroupFilters.filter('compare', function() {
    return function(obj, text, comparator, ignoreCase) {
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
});