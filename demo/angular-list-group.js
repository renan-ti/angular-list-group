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
  angularListGroupFilters.filter('listGroupItemContextualClass', function () {
    return function (value) {
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
        clazz = '{{$evalContextualClass(item)}}';
      }
      return clazz;
    };
  });
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
  var ListGroupCtrl = function ($scope, $parse, $filter, comparatorFactory) {
    $scope.$$selectedItems = [];
    $scope.$$items;
    $scope.filter = {
      text: '',
      placeholder: 'Search...',
      autoFilter: true,
      ignoreCase: false
    };
    $scope.$selectItem = function (item) {
      if (!$scope.$isDisabled(item)) {
        var idx = -1;
        if ((idx = $scope.$isSelected(item)) > -1) {
          $scope.$$selectedItems.splice(idx, 1);
        } else {
          if ($scope.$$selectedItems.length > 0 && !$scope.multiSelection == true) {
            $scope.$$selectedItems.length = 0;
          }
          $scope.$$selectedItems.push(item);
        }
      }
    };
    $scope.$isSelected = function (item) {
      var idx = -1;
      for (var i = 0, len = $scope.$$selectedItems.length; i < len; i++) {
        if (item === $scope.$$selectedItems[i]) {
          idx = i;
          break;
        }
      }
      return idx;
    };
    $scope.$isDisabled = function (item) {
      var disabled = $scope.disabled === 'true';
      if (!disabled) {
        var fn = $parse($scope.disabled);
        disabled = fn($scope.$parent, { item: item });
      }
      return disabled;
    };
    $scope.$evalContextualClass = function (item) {
      var fn = $parse($scope.contextualClass);
      var clazz = fn($scope.$parent, { $item: item });
      return $filter('listGroupItemContextualClass')(clazz);
    };
    $scope.$filter = function () {
      var comparator;
      if (angular.isDefined($scope.filter.operator)) {
        comparator = comparatorFactory[$scope.filter.operator];
        comparator.ignoreCase = $scope.filter.ignoreCase;
      }
      $scope.$$items = $filter('filter')($scope.items, $scope.filter.text, comparator);
    };
    $scope.$isFilterable = function () {
      return angular.isDefined($scope.filterable);
    };
    $scope.$resolvePanelContextualClassName = function () {
      var ctx = 'default';
      if (angular.isDefined($scope.panel)) {
        ctx = $scope.panel;
      }
      return 'panel-' + ctx;
    };
    var unbindSelectionChangeWatcher = $scope.$watch('$$selectedItems', function (newVal, oldVal) {
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
  };
  /**
 * @ngdoc directive
 * @name listGroup
 * 
 * @restrict A
 * 
 * @description Bootstrap list group
 * 
 * @param {Array}
 *                items Items to be displayed as list group
 * @param {Boolean|String}
 *                selectable Enables or disables item selection (default:
 *                false).
 *                <ul>
 *                <li>true, enables single item selection</li>
 *                <li>'single', enables single item selection</li>
 *                <li>'multiple', enables multiple item selection</li>
 *                </ul>
 * 
 * @param {Boolean|Object}
 *                filterable Makes the filter input visible or not (default :
 *                `false`)
 *                <p>
 *                Object properties :
 *                </p>
 *                <ul>
 *                <li> **placeholder** : _{String}_ text for filter input
 *                (default : `Search...`) </li>
 *                <li>**ignoreCase** : _{Boolean}_ Flag indicating if filter
 *                expression is case sensitive or not (default: `false`). Only
 *                applies if an `operator` is specified</li>
 *                <li>**autoFilter** : _{Boolean}_ Flag indicating whether
 *                filtering should be performed on every key up event or when
 *                the `Search` button is pressed (default : `true`) </li>
 *                <li>**operator** : _{String}_ Specify the comparison operator
 *                used for filtering. Operators are "**eq**" (equal to),
 *                "**neq**" (not equal to), "**startswith**", "**endswith**",
 *                "**contains**"</li>
 *                </ul>
 * 
 * @param {function}
 *                selectionChange Callback called when the list group selection
 *                has changed.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 */
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
    '$filter',
    'selectableListGroupTpl',
    'listGroupTpl',
    function ($parse, $compile, $interpolate, $q, $http, $templateCache, $filter, selectableListGroupTpl, listGroupTpl) {
      var getTemplate = function (templateUrl) {
        return $http.get(templateUrl, { cache: $templateCache });
      };
      var resolveInnerHTML = function (scope, attrs) {
        var resolved = false;
        var deferred = $q.defer();
        var promise = deferred.promise;
        var html = '';
        var contextualClass = $filter('listGroupItemContextualClass')(attrs.contextualClass);
        if (scope.$$isSelectable()) {
          html += '<a  class="list-group-item ' + contextualClass + '" ng-repeat="item in $$items" ng-href  ng-class="{active : ($isSelected(item) != -1), disabled : $isDisabled(item) }" ng-click="$selectItem(item)">';
        } else {
          html += '<li class="list-group-item ' + contextualClass + '" ng-repeat="item in $$items">';
        }
        if (angular.isDefined(attrs.template)) {
          html += scope.$parent.$eval(attrs.template);
          resolved = true;
        } else if (angular.isDefined(attrs.templateUrl)) {
          var templateUrl = scope.$parent.$eval(attrs.templateUrl);
          getTemplate(templateUrl).success(function (data) {
            html += data;
            html += scope.$$isSelectable() ? '</a>' : '</li>';
            deferred.resolve(html);
          });
        } else {
          html += '<span ng-bind="item"></span>';
          // promise = deferred.promise;
          resolved = true;
        }
        if (resolved) {
          html += scope.$$isSelectable() ? '</a>' : '</li>';
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
          if (angular.isDefined(attrs.filterable) || angular.isDefined(attrs.title) || angular.isDefined(attrs.header)) {
            tpl = $templateCache.get('panel-list-group.html');
          }
          return tpl;
        },
        controller: [
          '$scope',
          '$parse',
          '$filter',
          'comparatorFactory',
          ListGroupCtrl
        ],
        scope: {
          items: '=',
          selectable: '@',
          filterable: '@',
          selectionChange: '@',
          contextualClass: '@',
          disabled: '@',
          title: '@',
          panel: '@'
        },
        link: function (scope, element, attrs) {
          scope.$$items = scope.items;
          scope.multiSelection = attrs['selectable'] == 'multiple';
          scope.$$isSelectable = function () {
            var values = [
                'true',
                'single',
                'multiple'
              ];
            return values.indexOf(scope.selectable) > -1;
          };
          scope.$displayHeading = function () {
            return angular.isDefined(scope.title);
          };
          var promise = resolveInnerHTML(scope, attrs);
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
  angularListGroupDirectives.directive('listInputGroupItem', [
    '$compile',
    '$parse',
    '$templateCache',
    function ($compile, $parse, $templateCache) {
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
              if (angular.isDefined(fn)) {
                if (angular.isString(fn)) {
                  fn = $parse(fn);
                }
                fn($scope, { $item: $scope.ngModelCtrl.$modelValue });
              }  // $scope.$parent.$$invoke(fn, {
                 // $item : item
                 // });
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
            // $scope.resolveOptions = function() {
            // if ($scope.hasAttribute('options')) {
            // var opts = $scope.getAttributeAsObject('options');
            // $scope.options = angular.extend(scope.options, opts);
            // }
            // };
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
            var sizeClassnameMap = {
                'small': 'input-group-sm',
                'large': 'input-group-lg'
              };
            this.resolveSizeClassname = function (size) {
              return sizeClassnameMap[size];
            };
          }
        ];
      return {
        restrict: 'EA',
        terminal: true,
        replace: true,
        template: '<div class="input-group list-input-group-item"></div>',
        require: [
          'listInputGroupItem',
          '^listGroupEditor',
          '^ngModel'
        ],
        scope: { item: '=ngModel' },
        controller: ListInputGroupItemCtrl,
        compile: function (element, attrs) {
          return function (scope, element, attrs, ctrls, transcludeFn) {
            console.log('listInputGroupItem::compile::pre');
            var listInputGroupItemCtrl = ctrls[0];
            var listGroupEditorCtrl = ctrls[1];
            scope.actions = listGroupEditorCtrl.$$getActions();
            var sizeClassname = listInputGroupItemCtrl.resolveSizeClassname(attrs.size);
            if (sizeClassname) {
              element.addClass(sizeClassname);
            }
            if (attrs.selectable) {
              var newElm = $compile($templateCache.get('checkbox-input-group-addon.html'))(scope);
              element.append(newElm);
            }
            var tpl = listGroupEditorCtrl.getTemplate();
            if (tpl) {
              var newElm = $compile('<span class="form-control">' + tpl + '</span>')(scope);
              element.append(newElm);
            } else {
              var html = '<span class="form-control">';
              if (angular.isString(scope.item)) {
                html += scope.item;
              } else {
                html += angular.toJson(scope.item);
              }
              html += '</span>';
              var newElm = $compile(html)(scope);
              element.append(newElm);
            }
            var actions = listGroupEditorCtrl.$$getActions();
            angular.forEach(actions, function (action) {
              var inputGroup = angular.element('<div class="input-group-btn"></div>');
              var btn = angular.element('<button class="btn btn-default"></button>');
              var fn = $parse(action.fn);
              btn.bind('click', function () {
                scope.$apply(function () {
                  // scope(listGroupEditor > ngRepeat >
                  // listInputGroupItem)
                  fn(scope.$parent.$parent.$parent, { $item: scope.item });
                });
              });
              var icon = angular.element('<span class="glyphicon"></span>');
              if (action.icon) {
                icon.addClass(action.icon);
              }
              btn.append(icon);
              inputGroup.append(btn);
              element.append(inputGroup);
            });
          };
        }
      };
    }
  ]);
  var ACTIONS = {
      'edit': {
        'id': '$$edit',
        'icon': 'glyphicon-edit',
        'label': 'edit'
      },
      'delete': {
        'id': '$$delete',
        'icon': 'glyphicon-trash',
        'label': 'remove'
      },
      'validate': {
        'id': '$$validate',
        'icon': 'glyphicon-ok',
        'label': 'ok',
        'fn': '$validate(item)'
      },
      'cancel': {
        'id': 'remove',
        'icon': 'glyphicon-remove',
        'label': 'ok',
        'fn': '$cancel(item)'
      }
    };
  var ListGroupEditorCtrl = function ($scope, $parse, $filter, comparatorFactory) {
    new ListGroupCtrl($scope, $parse, $filter, comparatorFactory);
    this.$$actions = [];
    this.$$getActions = function () {
      return this.$$actions;
    };
    this.$$resolveActions = function () {
      if ($scope.actions) {
        var actions = angular.fromJson($scope.actions);
        if (angular.isArray(actions)) {
          this.$$actions = actions;
        } else if (angular.isObject(actions)) {
          this.$$actions.push(actions);
        }
      }
      if ($scope.editable) {
        var action = ACTIONS['edit'];
        if ($scope.onEdit) {
          action.fn = $scope.onEdit;
        }
        this.$$actions.push(action);
      }
      if ($scope.deletable) {
        var action = ACTIONS['delete'];
        if ($scope.onDelete) {
          action.fn = $scope.onDelete;
        }
        this.$$actions.push(action);
      }
    };
    this.template;
    this.getTemplate = function () {
      if (angular.isUndefined(this.template) && $scope.template) {
        this.template = $scope.$parent.$eval($scope.template);
      }
      return this.template;
    };
  };
  angularListGroupDirectives.directive('listGroupEditor', [
    '$parse',
    '$compile',
    '$interpolate',
    '$q',
    '$http',
    '$templateCache',
    function ($parse, $compile, $interpolate, $q, $http, $templateCache) {
      return {
        restrict: 'EA',
        terminal: true,
        replace: true,
        template: function (elem, attrs) {
          return $templateCache.get('panel-list-group.html');
        },
        controller: [
          '$scope',
          '$parse',
          '$filter',
          'comparatorFactory',
          ListGroupEditorCtrl
        ],
        scope: {
          items: '=',
          selectable: '@',
          filterable: '@',
          selectionChange: '@',
          contextualClass: '@',
          disabled: '@',
          title: '@',
          panel: '@',
          deletable: '@',
          onDelete: '@',
          editable: '@',
          onEdit: '@',
          actions: '@',
          template: '@',
          size: '@'
        },
        link: function (scope, element, attrs, ctrl) {
          ctrl.$$resolveActions();
          var itemElt = angular.element('<list-input-group-item ng-repeat="item in items" ng-model="item"></list-input-group-item>');
          if (scope.size) {
            itemElt.attr('size', scope.size);
          }
          element.append(itemElt);
          $compile(element)(scope);
        }
      };
    }
  ]);
  angular.module('angularListGroup').run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('checkbox-input-group-addon.html', '<span class="input-group-addon"><input type="checkbox" ng-model="$$model.selected"></span>');
      $templateCache.put('panel-list-group.html', '<div class="panel" ng-class="$resolvePanelContextualClassName()" ng-cloak=""><div class="panel-heading" ng-if="title" ng-class="{\'panel-heading-no-body\' : !$isFilterable()}"><h3 class="panel-title" ng-bind="title"></h3></div><div class="panel-body" ng-if="$isFilterable()"><div class="input-group" ng-if="!filter.autoFilter"><input type="text" class="form-control" placeholder="{{filter.placeholder}}" ng-model="filter.text"><div class="input-group-btn"><button class="btn btn-default" ng-click="$filter()" ng-disabled="!filter"><i class="glyphicon glyphicon-search"></i></button></div></div><input type="text" class="form-control" placeholder="{{filter.placeholder}}" ng-model="filter.text" ng-if="filter.autoFilter"></div><div class="panel-footer" ng-if="$displayFooter()" ng-bind-html="footer"></div></div>');
    }
  ]);
}(window, document));