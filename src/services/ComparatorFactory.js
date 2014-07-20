angularListGroupServices.factory('comparatorFactory', [
	'$parse',
	function($parse) {

	    var $$startsWith = function(str, starts) {
		if (starts === '')
		    return true;
		if (str == null || starts == null)
		    return false;
		str = String(str);
		starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;
	    };

	    var $$endsWith = function(str, ends) {
		if (ends === '')
		    return true;
		if (str == null || ends == null)
		    return false;
		str = String(str);
		ends = String(ends);
		return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
	    };

	    var factory = {};

	    /**
	     * 
	     */
	    factory.eq = function(obj, text) {
		factory.eq.ignoreCase;
		return factory.$compare(obj, text, function(obj, text) {
		    return angular.equals(obj, text);
		}, factory.eq.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.neq = function(obj, text) {
		if (text === '')
		    return true;
		if (obj == null || text == null)
		    return false;
		return !factory.eq(obj, text);
	    };
	    /**
	     * 
	     */
	    factory.startswith = function(obj, text) {
		factory.startswith.ignoreCase;
		return factory.$compare(obj, text, $$startsWith, factory.startswith.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.endswith = function(obj, text) {
		factory.endswith.ignoreCase;
		return factory.$compare(obj, text, $$endsWith, factory.endswith.ignoreCase);
	    };
	    /**
	     * 
	     */
	    factory.contains = function(obj, text) {
		factory.contains.ignoreCase;
		return factory.$compare(obj, text, function(str, text) {
		    return str.indexOf(text) > -1;
		}, factory.contains.ignoreCase);
	    };

	    /**
	     * 
	     */
	    factory.$compare = function(obj, text, comparator, ignoreCase) {
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

	    return factory;
	} ]);