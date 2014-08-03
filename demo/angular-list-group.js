(function (window, document) {
  'use strict';
  var angularListGroupServices = angular.module('angularListGroup.services', []);
  var angularListGroupDirectives = angular.module('angularListGroup.directives', []);
  var angularListGroupFilters = angular.module('angularListGroup.filters', []);
  angular.module('angularListGroup', [
    'angularListGroup.services',
    'angularListGroup.directives',
    'angularListGroup.filters'
  ]);
  angularListGroupServices.factory('comparatorFactory', [
    '$parse',
    function ($parse) {
      var $$startsWith = function (str, starts) {
        if (starts === '')
          return true;
        if (str == null || starts == null)
          return false;
        str = String(str);
        starts = String(starts);
        return str.length >= starts.length && str.slice(0, starts.length) === starts;
      };
      var $$endsWith = function (str, ends) {
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
      factory.eq = function (obj, text) {
        factory.eq.ignoreCase;
        return factory.$compare(obj, text, function (obj, text) {
          return angular.equals(obj, text);
        }, factory.eq.ignoreCase);
      };
      /**
	     * 
	     */
      factory.neq = function (obj, text) {
        if (text === '')
          return true;
        if (obj == null || text == null)
          return false;
        return !factory.eq(obj, text);
      };
      /**
	     * 
	     */
      factory.startswith = function (obj, text) {
        factory.startswith.ignoreCase;
        return factory.$compare(obj, text, $$startsWith, factory.startswith.ignoreCase);
      };
      /**
	     * 
	     */
      factory.endswith = function (obj, text) {
        factory.endswith.ignoreCase;
        return factory.$compare(obj, text, $$endsWith, factory.endswith.ignoreCase);
      };
      /**
	     * 
	     */
      factory.contains = function (obj, text) {
        factory.contains.ignoreCase;
        return factory.$compare(obj, text, function (str, text) {
          return str.indexOf(text) > -1;
        }, factory.contains.ignoreCase);
      };
      /**
	     * 
	     */
      factory.$compare = function (obj, text, comparator, ignoreCase) {
        if (text === '')
          return true;
        if (obj == null || text == null)
          return false;
        var match = false;
        if (obj && text && typeof obj === 'object' && typeof text === 'object') {
          for (var objKey in obj) {
            if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) && comparator(obj[objKey], text[objKey])) {
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
      };
      return factory;
    }
  ]);
  angularListGroupDirectives.directive('listGroupEditor', [
    '$parse',
    '$compile',
    '$interpolate',
    '$q',
    '$http',
    '$templateCache',
    function ($parse, $compile, $interpolate, $q, $http, $templateCache) {
      var ListGroupEditorCtrl = [
          '$scope',
          '$filter',
          '$log',
          function ($scope, $filter, $log) {
            $scope.$$delete = function ($item) {
              $log.debug('delete item => ' + angular.toJson($item));
              var p = $scope.deletable({ $item: $item });
              if (p && angular.isFunction(p.then)) {
                p.then(function (data) {
                  $scope.items = $filter('filter')($scope.items, function (item) {
                    return $item !== item;
                  });
                });
              } else {
                throw new Error('Delete callback must return a Promise');
              }
            };
            $scope.$$isDeletable = function () {
              return angular.isDefined($scope.deletable);
            };
          }
        ];
      var resolveInnerHTML = function (scope, attrs) {
        var resolved = false;
        var deferred = $q.defer();
        var promise = deferred.promise;
        var tokens = ['<list-input-group-item ng-repeat="item in items" ng-model="item" '];
        if (scope.$$isDeletable()) {
          tokens.push('deletable delete-fn="$$delete(item)"');
        }
        // html += 'deletable editable
        // actions=\'[{"id":"play","icon":"glyphicon-play",
        // "fn":"play(item)"},{"id":"pause","icon":"glyphicon-pause",
        // "fn":"pause(item)"},{"id":"stop","icon":"glyphicon-stop",
        // "fn":"stop(item)"}]\'>';
        tokens.push('>');
        tokens.push('</list-input-group-item>');
        deferred.resolve(tokens.join(' '));
        return promise;
      };
      return {
        restrict: 'EA',
        terminal: true,
        replace: true,
        template: function (elem, attrs) {
          var tpl = $templateCache.get('panel-list-editor.html');
          return tpl;
        },
        controller: ListGroupEditorCtrl,
        scope: {
          items: '=',
          deletable: '&'
        },
        link: function (scope, element, attrs) {
          scope.test = 'toto';
          var promise = resolveInnerHTML(scope, attrs);
          promise.then(function (html) {
            var cellElement = angular.element(html);
            element.append(cellElement);
            $compile(element)(scope);
          });
        }
      };
    }
  ]);
  angularListGroupDirectives.value('selectableListGroupTpl', 'selectable-list-group.html').value('listGroupTpl', 'list-group.html').directive('selectableListGroupTemplate', [
    'selectableListGroupTpl',
    function (selectableListGroupTpl) {
      return {
        replace: true,
        restrict: 'E',
        templateUrl: selectableListGroupTpl
      };
    }
  ]).directive('listGroupTemplate', [
    'listGroupTpl',
    function (listGroupTpl) {
      return {
        replace: true,
        restrict: 'E',
        templateUrl: listGroupTpl
      };
    }
  ]).directive('listGroup', [
    '$parse',
    '$compile',
    '$interpolate',
    '$q',
    '$http',
    '$templateCache',
    'selectableListGroupTpl',
    'listGroupTpl',
    function ($parse, $compile, $interpolate, $q, $http, $templateCache, selectableListGroupTpl, listGroupTpl) {
      var ListGroupCtrl = [
          '$scope',
          '$parse',
          '$filter',
          'comparatorFactory',
          function ($scope, $parse, $filter, comparatorFactory) {
            $scope.selectedItems = [];
            $scope.filter = {
              text: '',
              placeholder: 'Search...',
              autoFilter: true,
              ignoreCase: false
            };
            // displayed items list
            $scope.$items;
            $scope.evaluateContextualClass = function (item) {
              var fn = $parse($scope.contextualClass);
              var clazz = fn($scope.$parent, { $item: item });
              return resolveContextualClass(clazz);
            };
            /**
					 * 
					 */
            $scope.isDisabled = function (item) {
              var disabled = $scope.disabled === 'true';
              if (!disabled) {
                var fn = $parse($scope.disabled);
                disabled = fn($scope.$parent, { item: item });
              }
              return disabled;
            };
            $scope.selectItem = function (item) {
              if (!$scope.isDisabled(item)) {
                var idx = -1;
                if ((idx = $scope.isSelected(item)) > -1) {
                  $scope.selectedItems.splice(idx, 1);
                } else {
                  if ($scope.selectedItems.length > 0 && !$scope.multiSelection == true) {
                    $scope.selectedItems.length = 0;
                  }
                  $scope.selectedItems.push(item);
                }
              }
            };
            $scope.isSelected = function (item) {
              var idx = -1;
              for (var i = 0, len = $scope.selectedItems.length; i < len; i++) {
                if (item === $scope.selectedItems[i]) {
                  idx = i;
                  break;
                }
              }
              return idx;
            };
            $scope.$filter = function () {
              var comparator;
              if (angular.isDefined($scope.filter.operator)) {
                comparator = comparatorFactory[$scope.filter.operator];
                comparator.ignoreCase = $scope.filter.ignoreCase;
              }
              $scope.$items = $filter('filter')($scope.items, $scope.filter.text, comparator);
            };
            var unbindSelectionChangeWatcher = $scope.$watch('selectedItems', function (newVal, oldVal) {
                var fn = $parse($scope.selectionChange);
                var args = { item: newVal[0] };
                if ($scope.multiSelection == true) {
                  args = { items: newVal };
                }
                fn($scope.$parent, args);
              }, true);
            var unbindFilterWatcher = $scope.$watch('filter.text', function (newVal, oldVal) {
                if ($scope.filter.autoFilter == true) {
                  $scope.$filter();
                }
              });
            $scope.$on('$destroy', function () {
              unbindSelectionChangeWatcher();
              unbindFilterWatcher();
            });
          }
        ];
      var isSelectable = function (value) {
        var selectable = false;
        if (angular.isDefined(value)) {
          selectable = value == 'true' || value == 'single' || value == 'multiple';
        }
        return selectable;
      };
      var isFilterable = function (value) {
        var filterable = false;
        if (angular.isDefined(value)) {
          filterable = true;
        }
        return filterable;
      };
      /**
			     * 
			     */
      var loadTemplate = function (tpl) {
        var deferred = $q.defer();
        $http.get(tpl, { cache: $templateCache }).success(function (data) {
          $templateCache.put(tpl, data);
          deferred.resolve(data);
        }).error(function (err) {
          deferred.reject('Could not load template: ' + tpl);
        });
        return deferred.promise;
      };
      var resolveContextualClass = function (value) {
        var clazz = '';
        var acceptedValues = [
            'success',
            'info',
            'warning',
            'danger'
          ];
        if (acceptedValues.indexOf(value) > -1) {
          clazz = 'list-group-item-' + value;
        } else if (angular.isDefined(value)) {
          clazz = '{{evaluateContextualClass(item)}}';
        }
        return clazz;
      };
      // var resolveDisabledClass = function(value) {
      // var clazz = '';
      // if (value === 'true') {
      // clazz = 'disabled';
      // }
      // return clazz;
      // }
      var resolveInnerHTML = function (scope, attrs, selectable) {
        var resolved = false;
        var deferred = $q.defer();
        var promise = deferred.promise;
        var html = '';
        if (selectable) {
          html += '<a  class="list-group-item ' + resolveContextualClass(attrs.contextualClass) + '" ng-repeat="item in items" ng-href  ng-class="{active : (isSelected(item) != -1), disabled : isDisabled(item) }" ng-click="selectItem(item)">';
        } else {
          html += '<li class="list-group-item ' + resolveContextualClass(attrs['contextualClass']) + '" ng-repeat="item in $items">';
        }
        if (angular.isDefined(attrs.template)) {
          var tpl = scope.$parent.$eval(attrs.template);
          html += tpl;
          resolved = true;
        } else if (angular.isDefined(attrs.templateUrl)) {
          loadTemplate(scope.$parent.$eval(attrs.templateUrl)).then(function (tpl) {
            html += tpl;
            html += selectable ? '</a>' : '</li>';
            deferred.resolve(html);
          });
        } else {
          html += '<span ng-bind="item"></span>';
          promise = deferred.promise;
          resolved = true;
        }
        if (resolved) {
          html += selectable ? '</a>' : '</li>';
          deferred.resolve(html);
        }
        return promise;
      };
      return {
        restrict: 'EA',
        terminal: true,
        replace: true,
        template: function (elem, attrs) {
          var tpl = '<div class="list-group"></div>';
          if (isFilterable(attrs.filterable)) {
            tpl = $templateCache.get('panel-list-group.html');
          }
          return tpl;
        },
        controller: ListGroupCtrl,
        scope: {
          items: '=',
          selectable: '@',
          filterable: '@',
          selectionChange: '@',
          contextualClass: '@',
          disabled: '@'
        },
        link: function (scope, element, attrs) {
          scope.$items = scope.items;
          scope.multiSelection = attrs['selectable'] == 'multiple';
          var selectable = isSelectable(attrs['selectable']);
          var promise = resolveInnerHTML(scope, attrs, selectable);
          promise.then(function (html) {
            var cellElement = angular.element(html);
            element.append(cellElement);
            $compile(element)(scope);
          });
          var filterable = scope.$eval(attrs['filterable']);
          if (angular.isObject(filterable)) {
            scope.filterable = angular.extend(scope.filter, filterable);
          }
        }
      };
    }
  ]);
  angularListGroupDirectives.directive('listInputGroupItem', function () {
    var ACTION_EDIT = {
        'id': 'edit',
        'icon': 'glyphicon-edit',
        'label': 'edit',
        'fn': '$edit(item)'
      };
    var ACTION_VALIDATE = {
        'id': 'validate',
        'icon': 'glyphicon-ok',
        'label': 'ok',
        'fn': '$validate(item)'
      };
    var ACTION_CANCEL = {
        'id': 'remove',
        'icon': 'glyphicon-remove',
        'label': 'ok',
        'fn': '$cancel(item)'
      };
    var ACTION_DELETE = {
        'id': 'delete',
        'icon': 'glyphicon-trash',
        'label': 'remove',
        'fn': '$delete(item)'
      };
    var ListInputGroupItemCtrl = [
        '$scope',
        '$element',
        '$attrs',
        '$compile',
        '$interpolate',
        '$parse',
        '$sce',
        '$http',
        '$templateCache',
        '$timeout',
        function ($scope, $element, $attrs, $compile, $interpolate, $parse, $sce, $http, $templateCache, $timeout) {
          /**
				 * 
				 */
          $scope.$$model = {
            selected: false,
            html: '',
            editing: false
          };
          /**
				 * item actions
				 */
          $scope.actions = [];
          /**
				 * Render options
				 */
          $scope.options = {
            action: {
              display: {
                label: false,
                icon: true
              }
            }
          };
          /**
				 * 
				 */
          $scope.init = function () {
            $scope.resolveActions();
            $scope.resolveOptions();
            if ($scope.hasAttribute('selectable')) {
              $scope.$watch('$$model.selected', $scope.selectionChange);
            }
          };
          /**
				 * 
				 */
          $scope.resolveInnerHTML = function (item) {
            var html = '';
            var item = $scope.ngModelCtrl.$modelValue;
            if ($scope.hasAttribute('template')) {
              var tpl = $scope.$eval($attrs['template']);
              var ctx = $scope.$new();
              ctx.item = item;
              html = $interpolate(tpl)(ctx);
            } else if ($scope.hasAttribute('templateUrl')) {
              var src = $scope.$eval($attrs['templateUrl']);
              if (src) {
                $http.get(src, { cache: $templateCache }).success(function (response) {
                  var ctx = $scope.$new();
                  ctx.item = item;
                  html = $interpolate(response)(ctx);
                  $scope.$$model.html = $sce.trustAsHtml(html);
                });
              }
            } else if (!angular.isString(item)) {
              html = angular.toJson(item, true);
            } else {
              html = item;
            }
            $scope.$$model.html = $sce.trustAsHtml(html);
          };
          /**
				 * Selection change handler
				 */
          $scope.selectionChange = function (newVal, oldVal) {
            $parse($attrs['selectable']).assign($scope, newVal);
          };
          /**
				 * 
				 */
          $scope.$click = function (fn) {
            if (angular.isString(fn)) {
              fn = $parse(fn);
            }
            var item = $scope.ngModelCtrl.$modelValue;
            fn($scope, { item: item });
          };
          /**
				 * Edit action handler
				 */
          $scope.$edit = function () {
            if ($scope.hasAttribute('inline')) {
              $scope.startInlineEdition();
            } else {
              if ($scope.hasAttribute('editFn')) {
                var editFn = $parse($attrs['editFn']);
                var item = $scope.ngModelCtrl.$modelValue;
                editFn($scope, { item: item });
              }
            }
          };
          $scope.$validate = function () {
            $scope.ngModelCtrl.$setViewValue($scope.$$model.html);
            $scope.ngModelCtrl.$render();
            $scope.endInlineEdition();
          };
          $scope.$cancel = function () {
            $scope.$$model.html = $scope.ngModelCtrl.$modelValue;
            $scope.ngModelCtrl.$render();
            $scope.endInlineEdition();
          };
          /**
				 * Delete action handler
				 */
          $scope.$delete = function () {
            if ($scope.hasAttribute('deleteFn')) {
              var deleteFn = $parse($attrs['deleteFn']);
              var item = $scope.ngModelCtrl.$modelValue;
              deleteFn($scope, { item: item });
            }
          };
          /**
				 * Returns <code>true</code> if the action is rendered as a
				 * button dropdowns
				 */
          $scope.isDropDown = function (action) {
            return angular.isDefined(action.actions);
          };
          /**
				 * Returns <code>true</code> if the selectable attribute is
				 * specified
				 */
          $scope.isSelectable = function () {
            return $scope.hasAttribute('selectable');
          };
          /**
				 * Returns <code>true</code> if the size attribute is set to
				 * 'large'
				 */
          $scope.isLarge = function () {
            return $scope.isSizeEquals('large');
          };
          /**
				 * Returns <code>true</code> if the size attribute is set to
				 * 'small'
				 */
          $scope.isSmall = function () {
            return $scope.isSizeEquals('small');
          };
          /**
				 * Returns <code>true</code> if the size attribute is equal to
				 * the specified value
				 */
          $scope.isSizeEquals = function (value) {
            var equals = false;
            if ($scope.hasAttribute('size')) {
              equals = $attrs['size'] == value;
            }
            return equals;
          };
          $scope.resolveActions = function () {
            var actions = $scope.getAttributeAsObject('actions');
            if (angular.isDefined(actions) == true) {
              if (angular.isArray(actions)) {
                $scope.actions = actions;
              } else {
                $scope.actions.push(actions);
              }
            }
            if ($scope.hasAttribute('editable')) {
              $scope.actions.push(ACTION_EDIT);
            }
            if ($scope.hasAttribute('deletable')) {
              $scope.actions.push(ACTION_DELETE);
            }
          };
          $scope.resolveOptions = function () {
            if ($scope.hasAttribute('options')) {
              var opts = $scope.getAttributeAsObject('options');
              $scope.options = angular.extend(scope.options, opts);
            }
          };
          /**
				 * 
				 */
          $scope.startInlineEdition = function () {
            var tmp = [];
            angular.forEach($scope.actions, function (action) {
              if (action.id === ACTION_EDIT.id) {
                tmp.push(ACTION_VALIDATE);
                tmp.push(ACTION_CANCEL);
              } else {
                tmp.push(action);
              }
            });
            $scope.actions = tmp;
            $scope.$$model.editing = true;
            $timeout(function () {
              $element.find('input')[0].select();
            });
          };
          /**
				 * 
				 */
          $scope.endInlineEdition = function () {
            var tmp = [];
            angular.forEach($scope.actions, function (action) {
              if (action.id === ACTION_VALIDATE.id) {
                tmp.push(ACTION_EDIT);
              } else if (!(action.id === ACTION_CANCEL.id)) {
                tmp.push(action);
              }
            });
            $scope.actions = tmp;
            $scope.$$model.editing = false;
          };
          /**
				 * Returns the value of the attribute as an object.
				 */
          $scope.getAttributeAsObject = function (attrName) {
            var value = $attrs[attrName];
            if ($scope.hasAttribute(attrName) && angular.isString(value)) {
              value = angular.fromJson(value);
            }
            return value;
          };
          /**
				 * Returns <code>true</code> an attribute with the specified
				 * name exists
				 */
          $scope.hasAttribute = function (attrName) {
            return angular.isDefined($attrs[attrName]) == true;
          };
        }
      ];
    return {
      restrict: 'EA',
      terminal: true,
      replace: true,
      templateUrl: 'list-input-group-item.html',
      require: ['ngModel'],
      scope: true,
      controller: ListInputGroupItemCtrl,
      link: function (scope, element, attrs, ctrls) {
        scope.ngModelCtrl = ctrls[0];
        if (!scope.ngModelCtrl)
          return;
        scope.ngModelCtrl.$render = function () {
          scope.resolveInnerHTML(this.$modelValue);
        };
        scope.init();
      }
    };
  });
  angular.module('angularListGroup').run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('list-input-group-item.html', '<div class="input-group list-input-group-item" ng-class="{\'input-group-lg\' : isLarge(), \'input-group-sm\' : isSmall()}"><span class="input-group-addon" ng-if="isSelectable()"><input type="checkbox" ng-model="$$model.selected"></span><input type="text" class="form-control" ng-model="$$model.html" ng-if="$$model.editing"><span class="form-control" ng-bind-html="$$model.html" ng-if="!$$model.editing"></span><div class="input-group-btn" ng-repeat="action in actions track by action.id"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-if="isDropDown(action)"><span class="glyphicon {{action.icon}}" ng-if="options.action.display.icon"></span> <span ng-bind="action.label" ng-if="options.action.display.label"></span> <span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right" role="menu" ng-if="isDropDown(action) && !isSplit(action)"><li ng-repeat="child in action.actions"><a ng-href="" ng-click="$click(child.fn)"><span class="glyphicon {{child.icon}}" ng-if="options.action.display.icon"></span> <span ng-bind="child.label"></span></a></li></ul><button class="btn {{action.class}}" ng-class="{\'btn-default\' : action.class == null}" type="button" ng-click="$click(action.fn)" ng-if="!isDropDown(action)"><span class="glyphicon {{action.icon}}" ng-if="options.action.display.icon"></span>&nbsp; <span ng-bind="action.label" ng-if="options.action.display.label"></span></button></div></div>');
      $templateCache.put('panel-list-editor.html', '<div class="panel panel-default list-group-editor"><div class="panel-heading">title</div><div class="panel-body">test</div><div transclude=""></div></div>');
      $templateCache.put('panel-list-group.html', '<div class="panel panel-default"><div class="panel-body"><div class="input-group" ng-if="!filter.autoFilter"><input type="text" class="form-control" placeholder="{{filter.placeholder}}" ng-model="filter.text"><div class="input-group-btn"><button class="btn btn-default" ng-click="$filter()" ng-disabled="!filter"><i class="glyphicon glyphicon-search"></i></button></div></div><input type="text" class="form-control" placeholder="{{filter.placeholder}}" ng-model="filter.text" ng-if="filter.autoFilter"></div><div transclude=""></div></div>');
    }
  ]);
}(window, document));