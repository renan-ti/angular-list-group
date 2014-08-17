angularListGroupDirectives.directive('listInputGroupItem', function($compile, $parse, $templateCache, $timeout) {

    var ListInputGroupItemCtrl = [ '$scope', '$element', '$attrs', '$compile', '$interpolate', '$parse', '$sce',
	    '$http', '$templateCache', '$timeout',
	    function($scope, $element, $attrs, $compile, $interpolate, $parse, $sce, $http, $templateCache, $timeout) {

		$scope.$$model = {
		    selected : false,
		    editedValue : null
		};

		/**
		 * Render options
		 */
		$scope.options = {
		    action : {
			display : {
			    label : false,
			    icon : true
			}
		    }
		};

		/**
		 * Selection change handler
		 */
		$scope.selectionChange = function(newVal, oldVal) {
		    $parse($attrs['selectable']).assign($scope, newVal);
		};

		var sizeClassnameMap = {
		    'small' : 'input-group-sm',
		    'large' : 'input-group-lg'
		}

		this.resolveSizeClassname = function(size) {
		    return sizeClassnameMap[size];
		}

	    } ];

    return {
	restrict : 'EA',
	terminal : true,
	replace : true,
	template : '<div class="input-group list-input-group-item"></div>',
	// require : [ 'ngModel' ],
	require : [ 'listInputGroupItem', '^listGroupEditor', '^ngModel' ],
	scope : {
	    item : '=ngModel'
	},
	controller : ListInputGroupItemCtrl,
	compile : function(element, attrs) {
	    return function(scope, element, attrs, ctrls, transcludeFn) {
		console.log('listInputGroupItem::compile::pre');

		var hiddenElementClassname = 'list-input-group-item-control-hidden';
		var editing = false;

		var listInputGroupItemCtrl = ctrls[0];

		var listGroupEditorCtrl = ctrls[1];

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

		function beginEditing() {
		    if (!editing) {
			scope.$apply(function() {
			    editing = true;
			    var tpl = listGroupEditorCtrl.getEditTemplate();
			    var editElm = $compile(tpl)(scope.$new());
			    var readElm = angular.element(element.children()[0]);
			    readElm.addClass(hiddenElementClassname);

			    editElm.bind('blur', function() {
				endEditing();
			    });
			    element.prepend(editElm);
			    $timeout(function() {
				editElm[0].focus();
			    });
			});
		    }
		}

		function endEditing() {
		    if (editing) {
			var readElm = angular.element(element.children()[1]);
			var editElm = angular.element(element.children()[0]);
			editElm.unbind('blur');
			editElm.remove();
			readElm.removeClass(hiddenElementClassname);
			editing = false;
		    }
		}

		var actions = listGroupEditorCtrl.$$getActions();
		angular.forEach(actions, function(action) {
		    var inputGroup = angular.element('<div class="input-group-btn"></div>');
		    var btn = angular.element('<button class="btn btn-default"></button>');

		    if (listGroupEditorCtrl.isEditingInline()) {
			btn.bind('click', function() {
			    beginEditing();
			});
		    } else {
			var fn = $parse(action.fn);
			btn.bind('click', function() {
			    scope.$apply(function() {
				// scope(listGroupEditor > ngRepeat > //
				// listInputGroupItem)
				fn(scope.$parent.$parent.$parent, {
				    $item : scope.item
				});
			    });
			});
		    }

		    var icon = angular.element('<span class="glyphicon"></span>');
		    if (action.icon) {
			icon.addClass(action.icon);
		    }
		    btn.append(icon);
		    inputGroup.append(btn);
		    element.append(inputGroup);
		});
	    }
	}
    }

});