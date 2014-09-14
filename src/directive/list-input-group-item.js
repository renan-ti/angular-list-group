angularListGroupDirectives.directive('listInputGroupItem', function($compile, $parse, $templateCache, $timeout,
	listGroupComponentFactory, $animate, $log) {

    var ListInputGroupItemCtrl = [ '$scope', '$element', '$attrs', '$compile', '$interpolate', '$parse', '$sce',
	    '$http', '$templateCache', '$timeout',
	    function($scope, $element, $attrs, $compile, $interpolate, $parse, $sce, $http, $templateCache, $timeout) {

		$scope.$$model = {
		    selected : false,
		    editedValue : null
		};

		/**
		 * Selection change handler
		 */
		$scope.$onSelectionChange = function() {
		    var selected = $scope.$$model.selected;
		    console.log('selected => ' + selected);
		};

		$scope.selectionChangeHandler = null;

		$scope.$watch('$$model.selected', function() {
		    if ($scope.selectionChangeHandler == null) {
			$scope.selectionChangeHandler = $scope.$onSelectionChange;
		    } else {
			$scope.$onSelectionChange();
		    }
		});

	    } ];

    return {
	restrict : 'EA',
	terminal : true,
	replace : true,
	template : '<div class="input-group list-input-group-item"></div>',
	require : [ 'listInputGroupItem', '^listGroupEditor' ],
	scope : false,
	controller : ListInputGroupItemCtrl,
	compile : function(element, attrs) {
	    return function(scope, element, attrs, ctrls, transcludeFn) {
		console.log('listInputGroupItem::compile::pre');

		var hiddenElementClassname = 'list-input-group-item-control-hidden';
		var editing = false;

		var listInputGroupItemCtrl = ctrls[0];
		var listGroupEditorCtrl = ctrls[1];

		scope.$inlineEdition = {
		    cancel : function() {
			endEditing();
		    },
		    update : function() {
			var oldValue = scope.$$item;
			var newValue = scope.$$model.editedValue;
			if (listGroupEditorCtrl.updateItem(oldValue, newValue)) {
			    endEditing();
			} else {
			    listGroupComponentFactory.addHasError(element.children()[0]);
			}
		    }
		}

		var sizeClassname = listGroupComponentFactory.resolveSizeClassName(attrs.size);
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
		    if (angular.isString(scope.$$item)) {
			html += scope.$$item;
		    } else {
			html += angular.toJson(scope.$$item);
		    }
		    html += '</span>';
		    var newElm = $compile(html)(scope);
		    element.append(newElm);
		}

		function beginEditing() {
		    if (!editing) {
			scope.$apply(function() {
			    editing = true;
			    scope.$$model.editedValue = scope.$$item;
			    var tpl = listGroupEditorCtrl.getEditTemplate();
			    var editElm = $compile(tpl)(scope);
			    var readElm = angular.element(element.children()[0]);
			    readElm.addClass(hiddenElementClassname);

			    $animate.enter(editElm, element).then(function() {
				$timeout(function() {
				    var elts = angular.element(editElm).find('input');
				    if (elts && elts[0]) {
					elts[0].focus();
					elts[0].select();
				    }
				});
			    });

			});
		    }
		}

		function endEditing() {
		    var promise = null;
		    if (editing) {
			var readElm = angular.element(element.children()[1]);
			var editElm = angular.element(element.children()[0]);
			promise = $animate.leave(editElm);
			promise.then(function() {
			    readElm.removeClass(hiddenElementClassname);
			    editing = false;
			    scope.$$model.editedValue = null;
			});
		    }
		    return promise;
		}

		function buildActions(actions, inlineEditionMode) {
		    angular.forEach(actions, function(action) {
			var inputGroup = listGroupComponentFactory.createInputGroup();
			var btn = listGroupComponentFactory.createButton(action.icon);
			var onClickFn = null;
			if (inlineEditionMode) {
			    onClickFn = beginEditing;
			} else {
			    var fn = $parse(action.fn);
			    onClickFn = function() {
				scope.$apply(function() {
				    fn(scope.$parent.$parent, {
					$item : scope.$$item
				    });
				});
			    };
			}
			btn.bind('click', onClickFn);
			inputGroup.append(btn);
			element.append(inputGroup);
		    });
		}

		buildActions(listGroupEditorCtrl.$$getActions(), listGroupEditorCtrl.isInlineEditionMode());

	    }
	}
    }

});