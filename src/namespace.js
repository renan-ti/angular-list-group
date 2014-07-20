var angularListGroupServices = angular.module('angularListGroup.services', []);
var angularListGroupDirectives = angular.module('angularListGroup.directives',
		[]);
var angularListGroupFilters = angular.module('angularListGroup.filters', []);

angular.module('angularListGroup', [ 'angularListGroup.services',
		'angularListGroup.directives', 'angularListGroup.filters' ]);