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

var listGroupServices = angular.module('listGroup.services', []);
var listGroupDirectives = angular.module('listGroup.directives', []);
var listGroupFilters = angular.module('listGroup.filters', []);

angular.module('listGroup', [ 'listGroup.services', 'listGroup.filters', 'listGroup.directives' ]);