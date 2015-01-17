var angularListGroupServices = angular.module('angularListGroup.services', []);
var angularListGroupDirectives = angular.module('angularListGroup.directives', []);
var angularListGroupFilters = angular.module('angularListGroup.filters', []);

angular.module('listGroup', [ 'angularListGroup.services', 'angularListGroup.filters', 'angularListGroup.directives' ]);