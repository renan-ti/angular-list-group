'use strict';

describe(
	'listGroup',
	function() {

	    var $compile, $rootScope;

	    beforeEach(module('listGroup'));
	    beforeEach(module("list-group.tpl.html"));
	    beforeEach(module("linked-list-group.tpl.html"));

	    beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	    }));

	    it('should bind to a model', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		var element = $compile("<div list-group items='colors'></div>")($rootScope);
		$rootScope.$digest();
		expect(element.children().length).toBe(3);

		$rootScope.$apply("colors = ['red','green','blue','yellow']");
		var element = $compile("<div list-group items='colors'></div>")($rootScope);
		$rootScope.$digest();
		expect(element.children().length).toBe(4);
	    });

	    it(
		    'should use label property to render item',
		    function() {
			$rootScope
				.$apply("colors = [ {'label' : 'Red','hex' : '#FF0000'}, {'label' : 'Orange','hex' : '#FF7F00'} ]");
			var element = $compile("<list-group items='colors'></list-group>")($rootScope);
			$rootScope.$digest();
			expect($.trim(angular.element(element.children()[0]).text())).toBe('Red');
		    });

	    it(
		    'should use label function to render item',
		    function() {
			$rootScope
				.$apply("colors = [ {'name' : 'Red','hex' : '#FF0000'}, {'name' : 'Orange','hex' : '#FF7F00'} ]");
			$rootScope.myLabelFn = function(item) {
			    return item.name + ' (' + item.hex + ')';
			}
			var element = $compile("<list-group items='colors' label-fn='myLabelFn(item)'></list-group>")(
				$rootScope);
			$rootScope.$digest();
			expect($.trim(angular.element(element.children()[0]).text())).toBe('Red (#FF0000)');
		    });

	    it('should be selectable', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		var element = $compile("<list-group items='colors' selectable></list-group>")($rootScope);
		$rootScope.$digest();

		var redElt = angular.element(element.children()[0]);
		var greenElt = angular.element(element.children()[1]);
		var blueElt = angular.element(element.children()[2]);
		greenElt.triggerHandler('click');
		expect(redElt.hasClass('active')).toBeFalsy();
		expect(greenElt.hasClass('active')).toBeTruthy();
		expect(blueElt.hasClass('active')).toBeFalsy();

		blueElt.triggerHandler('click');
		expect(redElt.hasClass('active')).toBeFalsy();
		expect(greenElt.hasClass('active')).toBeFalsy();
		expect(blueElt.hasClass('active')).toBeTruthy();

	    });

	    it('should select multiple items', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		var element = $compile("<list-group items='colors' selectable='multiple'></list-group>")($rootScope);
		$rootScope.$digest();

		var redElt = angular.element(element.children()[0]);
		var greenElt = angular.element(element.children()[1]);
		var blueElt = angular.element(element.children()[2]);

		greenElt.triggerHandler('click');
		blueElt.triggerHandler('click');

		expect(redElt.hasClass('active')).toBeFalsy();
		expect(greenElt.hasClass('active')).toBeTruthy();
		expect(blueElt.hasClass('active')).toBeTruthy();
	    });

	    it(
		    'should bind selectedItems',
		    function() {
			$rootScope.$apply("colors = ['red','green','blue']");
			$rootScope.$apply("selectedItems = []");

			var element = $compile(
				"<list-group items='colors' selectable='multiple' selected-items='selectedItems'></list-group>")
				($rootScope);
			$rootScope.$digest();

			var redElt = angular.element(element.children()[0]);
			var greenElt = angular.element(element.children()[1]);
			var blueElt = angular.element(element.children()[2]);

			greenElt.triggerHandler('click');
			blueElt.triggerHandler('click');

			expect($rootScope.selectedItems.length).toBe(2);
			expect($rootScope.selectedItems).toEqual([ 'green', 'blue' ]);
		    });

	    it(
		    'should bind beforeSelectionChange',
		    function() {
			$rootScope.$apply("colors = ['red','green','blue']");
			$rootScope.beforeSelectionChangeHandler = function(item) {
			    return item != 'red';
			}
			var element = $compile(
				'<list-group items="colors" selectable="multiple" before-selection-change="beforeSelectionChangeHandler(item)"> </list-group>')
				($rootScope);
			$rootScope.$digest();

			var redElt = angular.element(element.children()[0]);
			redElt.triggerHandler('click');
			expect(redElt.hasClass('active')).toBeFalsy();
		    });

	    it(
		    'should handle beforeSelectionChange promise',
		    inject(function($q, $timeout) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			$rootScope.$apply("colors = ['red','green','blue']");
			$rootScope.beforeSelectionChangeHandler = function(item) {
			    $timeout(function() {
				deferred.resolve(true);
			    });
			    return promise;
			}

			var element = $compile(
				'<list-group items="colors" selectable="multiple" before-selection-change="beforeSelectionChangeHandler(item)"> </list-group>')
				($rootScope);
			$rootScope.$digest();

			var greenElt = angular.element(element.children()[1]);
			greenElt.triggerHandler('click');
			expect(greenElt.hasClass('active')).toBeFalsy();
			$timeout.flush();
			expect(greenElt.hasClass('active')).toBeTruthy();
		    }));

	    it(
		    'should bind afterselectionchange',
		    function() {
			var afterSelectionChangeHandlerCalled = false;
			$rootScope.$apply("colors = ['red','green','blue']");
			$rootScope.afterSelectionChangeHandler = function(item) {
			    afterSelectionChangeHandlerCalled = true;
			}

			var element = $compile(
				'<list-group items="colors" selectable="multiple" after-selection-change="afterSelectionChangeHandler(item)"> </list-group>')
				($rootScope);
			$rootScope.$digest();

			var greenElt = angular.element(element.children()[1]);
			greenElt.triggerHandler('click');
			expect(afterSelectionChangeHandlerCalled).toBeTruthy();
		    });

	    it('should be disabled', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		$rootScope.$apply("disabled = true");
		var element = $compile(
			'<list-group items="colors" selectable="multiple" disabled="disabled"> </list-group>')(
			$rootScope);
		$rootScope.$digest();
		var children = element.children();
		for ( var i = 0; i < children.length; i++) {
		    var child = angular.element(children[i]);
		    expect(child.hasClass('disabled')).toBeTruthy();
		}
		$rootScope.$apply("disabled = false");
		$rootScope.$digest();
		for ( var i = 0; i < children.length; i++) {
		    var child = angular.element(children[i]);
		    expect(child.hasClass('disabled')).toBeFalsy();
		}
	    });

	    it(
		    'should bind disabled callback function',
		    function() {
			$rootScope.$apply("colors = ['red','green','blue']");
			$rootScope.disableFnHandler = function(item) {
			    return item != 'green';
			};
			var element = $compile(
				'<list-group items="colors" selectable="multiple" disabled="disableFnHandler(item)"> </list-group>')
				($rootScope);
			$rootScope.$digest();

			expect(angular.element(element.children()[0]).hasClass('disabled')).toBeTruthy();
			expect(angular.element(element.children()[1]).hasClass('disabled')).toBeFalsy();
			expect(angular.element(element.children()[2]).hasClass('disabled')).toBeTruthy();

		    });

	    it('should add contextual class', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		var element = $compile(
			'<list-group items="colors" contextual-class="list-group-item-success"> </list-group>')(
			$rootScope);
		$rootScope.$digest();
		var children = element.children();
		for ( var i = 0; i < children.length; i++) {
		    var child = angular.element(children[i]);
		    expect(child.hasClass('list-group-item-success')).toBeTruthy();
		}

		$rootScope.clazz = 'list-group-item-warning';
		element = $compile('<list-group items="colors" contextual-class="{{clazz}}"> </list-group>')
			($rootScope);
		$rootScope.$digest();
		var children = element.children();
		for ( var i = 0; i < children.length; i++) {
		    var child = angular.element(children[i]);
		    expect(child.hasClass('list-group-item-warning')).toBeTruthy();
		}
	    });

	    it('should bind contextual class callback function', function() {
		$rootScope.$apply("colors = ['red','green','blue']");
		$rootScope.contextualClassFnHandler = function(item) {
		    var clazz = 'list-group-item-success';
		    if (item == 'green') {
			clazz = 'list-group-item-warning';
		    }
		    return clazz;
		};
		var element = $compile(
			'<list-group items="colors" contextual-class="contextualClassFnHandler(item)"></list-group>')(
			$rootScope);
		$rootScope.$digest();
		expect(angular.element(element.children()[0]).hasClass('list-group-item-success')).toBeTruthy();
		expect(angular.element(element.children()[1]).hasClass('list-group-item-warning')).toBeTruthy();
		expect(angular.element(element.children()[2]).hasClass('list-group-item-success')).toBeTruthy();
	    });

	});
