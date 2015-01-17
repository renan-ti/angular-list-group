'use strict';

describe('listGroup', function() {

    var $compile, $rootScope;

    beforeEach(module('listGroup'));
    beforeEach(module("list-group.tpl.html"));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
	$compile = _$compile_;
	$rootScope = _$rootScope_;
    }));

    it('should bind to a model', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	var element = $compile("<div data-list-group items='colors'></div>")($rootScope);
	$rootScope.$digest();
	expect(element.children().length).toBe(3);

	$rootScope.$apply("colors = ['red','green','blue','yellow']");
	var element = $compile("<div data-list-group items='colors'></div>")($rootScope);
	$rootScope.$digest();
	expect(element.children().length).toBe(4);
    });

});