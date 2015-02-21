'use strict';

/**
 * Returns <code>true</code> if the supplied argument is a promise,
 * <code>false</code> otherwise
 * 
 * @param {*}
 *                an object
 * @returns {boolean}
 */
function isPromise(obj) {
    var promise = false;
    if (obj && obj.then && angular.isFunction(obj.then)) {
	promise = true;
    }
    return promise;
}

var angularListGroupServices = angular.module('angularListGroup.services', []);
var angularListGroupDirectives = angular.module('angularListGroup.directives', []);
var angularListGroupFilters = angular.module('angularListGroup.filters', []);

angular.module('listGroup', [ 'angularListGroup.services', 'angularListGroup.filters', 'angularListGroup.directives' ]);