'use strict';

function ListGroupEditorWidget() {

    this.root = null;

    this.listGroup;

    this.wrap = function(root) {
	this.root = root;
	this.listGroup = angular.element(root).find('.list-group').first();
    }

    this.getItems = function() {
	return this.listGroup.children();
    }

    this.countItems = function() {
	return this.getItems().length;
    }

    this.countChildren = function(elt) {
	return angular.element(elt).children().length;
    }

    this.getActions = function(elt) {
	var actions = [];
	var buttonGroupElt = angular.element(elt).find('.input-group-btn');
	if (buttonGroupElt) {
	    actions = buttonGroupElt.children();
	}
	return actions;
    }

    this.getDeleteAction = function(item) {
	var action = null;
	var actions = this.getActions(item);
	for ( var i = 0; i < actions.length; i++) {
	    if (this.isDeleteAction(actions[i])) {
		action = actions[i];
		break;
	    }
	}
	return action;
    }

    this.countActions = function(elt) {
	return this.getActions(elt).length;
    }

    this.isEditAction = function(elt) {
	return angular.element(elt).find('i.fa-pencil-square-o').length > 0;
    }

    this.isDeleteAction = function(elt) {
	return angular.element(elt).find('i.fa-trash-o').length > 0;
    }

}

describe('listGroupEditor', function() {

    var $compile, $rootScope, widget;

    beforeEach(module('listGroup'));
    beforeEach(module("list-group.tpl.html"));
    beforeEach(module("linked-list-group.tpl.html"));
    beforeEach(module("panel-list-group.tpl.html"));
    beforeEach(module("panel-list-group-title.tpl.html"));
    beforeEach(module("list-group-filter.tpl.html"));
    beforeEach(module('panel-editable-list-group.tpl.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
	$compile = _$compile_;
	$rootScope = _$rootScope_;
	widget = new ListGroupEditorWidget();
    }));

//    it('should bind to a model', function() {
//	$rootScope.$apply("colors = ['red','green','blue']");
//	var element = $compile("<list-group-editor items='colors' />")($rootScope);
//	$rootScope.$digest();
//	widget.wrap(element);
//	expect(widget.countItems()).toBe(3);
//	angular.forEach(widget.getItems(), function(itemElt) {
//	    expect(widget.countActions(itemElt)).toBe(2);
//	});
//
//    });
//
//    it('should remove delete button when deletable is false', function() {
//	$rootScope.$apply("colors = ['red','green','blue']");
//	var element = $compile("<list-group-editor items='colors' deletable='false' />")($rootScope);
//	$rootScope.$digest();
//	widget.wrap(element);
//	angular.forEach(widget.getItems(), function(itemElt) {
//	    expect(widget.countActions(itemElt)).toBe(1);
//	    expect(widget.isEditAction(widget.getActions(itemElt).first())).toBeTruthy();
//	});
//    });

    it('should bind deletable callback function', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.deletableCallbackFn = function(item) {
	    return item != 'green';
	};
	var element = $compile("<list-group-editor items='colors' deletable='deletableCallbackFn($item)' />")(
		$rootScope);
	$rootScope.$digest();
	widget.wrap(element);
	var items = widget.getItems();
	for ( var i = 0; i < items.length; i++) {
	    var item = items[i];
	    var deleteAction = widget.getDeleteAction(item);
	    var isDisabled = angular.element(deleteAction).attr('disabled') === 'disabled';
	    if (i == 1) {
		expect(isDisabled).toBeTruthy();
	    } else {
		expect(isDisabled).toBeFalsy();
	    }
	}
    });

//    it('should remove edit button when edtibale is false', function() {
//	$rootScope.$apply("colors = ['red','green','blue']");
//	var element = $compile("<list-group-editor items='colors' editable='false' />")($rootScope);
//	$rootScope.$digest();
//	widget.wrap(element);
//	angular.forEach(widget.getItems(), function(itemElt) {
//	    expect(widget.countActions(itemElt)).toBe(1);
//	    expect(widget.isDeleteAction(widget.getActions(itemElt).first())).toBeTruthy();
//	});
//    });

});